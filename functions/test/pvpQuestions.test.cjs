const { test } = require("node:test");
const assert = require("node:assert/strict");
const { buildPvpRounds } = require("../lib/pvpQuestions");

const catalog = () => ({
    version: "test-version",
    champions: ["Ahri", "Ashe", "Akali", "Aatrox"].map((id, index) => ({
        id, name: id, title: "Unique title " + index,
        blurb: id + " travels through a fictional test landscape. <b>" + id + "</b> protects its inhabitants.",
    })),
    abilities: [{ championId: "Ahri", name: "Test ability", image: "ability.png" }],
    regions: [{ championId: "Ahri", region: "ionia" }],
    items: Object.fromEntries([1001, 1002, 1003, 1004].map((id) => [id, {
        name: "Item " + id, image: { full: id + ".png" }, maps: { 11: true }, gold: { purchasable: true },
    }])),
    summonerSpells: ["Flash", "Heal", "Barrier", "Ignite"].map((id) => ({
        id, name: id, image: { full: id + ".png" }, modes: ["CLASSIC"],
    })),
});
const seeded = (seed) => {
    seed = Math.imul(seed, 0x9e3779b9) >>> 0;
    return () => {
        seed = (1664525 * seed + 1013904223) >>> 0;
        return seed / 4294967296;
    };
};
const manyRounds = (data) => Array.from({ length: 40 }, (_, index) => buildPvpRounds(data, seeded(index + 1))).flat();

test("questions: five distinct categories have four unique answers and one private solution", () => {
    const categories = new Set();
    const answerPositions = new Set();
    for (let seed = 1; seed <= 40; seed += 1) {
        const rounds = buildPvpRounds(catalog(), seeded(seed));
        assert.equal(rounds.length, 5);
        assert.equal(new Set(rounds.map(({ question }) => question.category)).size, 5);
        for (const { question, secret } of rounds) {
            categories.add(question.category);
            assert.equal(question.dataVersion, "test-version");
            assert.equal(question.options.length, 4);
            assert.equal(new Set(question.options.map((option) => option.id)).size, 4);
            assert.equal(new Set(question.options.map((option) => option.name.toLowerCase())).size, 4);
            assert.equal(question.options.filter((option) => option.id === secret.answerId).length, 1);
            assert.equal(question.answerId, undefined);
            assert.equal(question.secret, undefined);
            answerPositions.add(question.options.findIndex((option) => option.id === secret.answerId));
        }
    }
    assert.equal(categories.size, 6);
    assert.equal(answerPositions.size, 4);
});

test("questions: lore strips markup and redacts the champion's name", () => {
    for (const { question } of manyRounds(catalog()).filter(({ question }) => question.category === "Lore")) {
        assert.ok(question.text.includes("[...]"));
        assert.doesNotMatch(question.text, /Ahri|Ashe|Akali|Aatrox|<b>/i);
        assert.equal(question.image, null);
    }
});

test("questions: punctuation and multi-part champion names are safely redacted", () => {
    const data = catalog();
    data.champions[0] = {
        id: "Nunu", name: "Nunu & Willump", title: "A unique test title",
        blurb: "Nunu &amp; Willump explore a fictional test landscape together. Willump always protects Nunu.",
    };
    data.abilities[0].championId = "Nunu";
    data.regions[0].championId = "Nunu";
    const questions = manyRounds(data).filter((round) => round.question.category === "Lore" && round.secret.answerId === "Nunu");
    assert.ok(questions.length);
    questions.forEach(({ question }) => assert.doesNotMatch(question.text, /Nunu|Willump|&amp;/i));
});

test("questions: unavailable, special-mode and duplicate items are not offered", () => {
    const data = catalog();
    data.items[2001] = { ...data.items[1001], maps: { 12: true }, name: "Other map item" };
    data.items[2002] = { ...data.items[1001], gold: { purchasable: false }, name: "Unavailable item" };
    data.items[2003] = { ...data.items[1001], inStore: false, name: "Hidden item" };
    data.items[2004] = { ...data.items[1001], requiredChampion: "Ornn", name: "Special upgrade" };
    data.items[2005] = { ...data.items[1001], name: "item 1001" };
    data.items[2006] = { ...data.items[1001], name: "Another item with the same icon" };
    data.summonerSpells.push({ id: "Other", name: "Other spell", image: { full: "other.png" }, modes: ["ARAM"] });
    for (const { question } of manyRounds(data).filter(({ question }) => ["Items", "Summoner spells"].includes(question.category))) {
        question.options.forEach((option) => {
            assert.doesNotMatch(option.id, /200[1-6]|Other/);
            assert.equal(option.icon, undefined);
            assert.equal(option.image, undefined);
        });
    }
});

test("questions: absent or conflicting region data is skipped without repeating categories", () => {
    for (const regions of [[], [{ championId: "Missing", region: "ionia" }],
        [{ championId: "Ahri", region: "ionia" }, { championId: "Ahri", region: "noxus" }]]) {
        const rounds = buildPvpRounds({ ...catalog(), regions }, seeded(1));
        assert.equal(rounds.length, 5);
        assert.ok(rounds.every(({ question }) => question.category !== "Regions"));
    }
});

test("questions: incomplete data fails instead of producing ambiguous or short quizzes", () => {
    assert.throws(() => buildPvpRounds({ ...catalog(), champions: [] }), { code: "unavailable" });
    assert.throws(() => buildPvpRounds({ ...catalog(), regions: [], items: {} }), { code: "unavailable" });
    const data = catalog();
    data.champions.forEach((champion) => { champion.title = "Duplicate title"; });
    assert.ok(buildPvpRounds(data).every(({ question }) => question.category !== "Champions"));
});
