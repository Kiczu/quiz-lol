const { randomBytes, randomUUID } = require("node:crypto");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const assert = require("node:assert/strict");
const { after, before, beforeEach, test } = require("node:test");
const admin = require("firebase-admin");

const projectId = process.env.GCLOUD_PROJECT || JSON.parse(readFileSync(resolve(__dirname, "../../.firebaserc"))).projects.default;
process.env.FIRESTORE_EMULATOR_HOST ||= "127.0.0.1:8080";
process.env.FIREBASE_AUTH_EMULATOR_HOST ||= "127.0.0.1:9099";
for (const host of [process.env.FIRESTORE_EMULATOR_HOST, process.env.FIREBASE_AUTH_EMULATOR_HOST]) {
    assert.match(host, /^(127\.0\.0\.1|localhost):\d+$/, "Tests only run against local emulators.");
}
admin.initializeApp({ projectId });
const { searchForOpponent, cancelSearch } = require("../lib/matchmaking");
const db = admin.firestore();
const refs = [];
const players = [];
let functionsHost = "127.0.0.1:5001";

const call = async (name, data, player = players[0]) => {
    const response = await fetch(`http://${functionsHost}/${projectId}/europe-west1/${name}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(player ? { Authorization: `Bearer ${player.token}` } : {}) },
        body: JSON.stringify({ data }),
        signal: AbortSignal.timeout(45_000),
    });
    const body = await response.json();
    if (body.error) throw Object.assign(new Error(body.error.message), { code: body.error.status });
    return body.result;
};

const profile = (player) => db.collection("scores").doc(player.uid);
const score = async (player = players[0]) => (await profile(player).get()).data();
const question = {
    spellName: "Test ability",
    spellIcon: "https://example.com/spell.png",
    options: ["Ahri", "Ashe", "Akali", "Aatrox"].map((id) => ({ id, name: id, icon: `${id}.png` })),
};

const loadMatchQuestions = async () => Array.from({ length: 5 }, () => ({ question, secret: { championId: "Ahri" } }));
const ticket = (player) => db.collection("pvpQueue").doc(player.uid);
const findOpponent = async (player, searchId, load = loadMatchQuestions) => {
    const result = await searchForOpponent(player.uid, searchId, load);
    if (result.code) refs.push(db.collection("pvpRooms").doc(result.code));
    return result;
};

const solo = async (gameId = "Skills", overrides = {}) => {
    const ref = db.collection("rounds").doc();
    refs.push(ref);
    await ref.set({ uid: players[0].uid, gameId, question, used: [], wrongGuesses: 0, points: 0, finished: false, results: {}, ...overrides });
    await ref.collection("secret").doc("answer").set({ championId: "Ahri", region: "ionia", name: "AHRI" });
    return ref;
};

const room = async (overrides = {}) => {
    const ref = db.collection("pvpRooms").doc(randomBytes(3).toString("hex").toUpperCase());
    refs.push(ref);
    await ref.set({
        mode: "private", status: "waiting", playerIds: [players[0].uid],
        players: [{ uid: players[0].uid, name: "Host", score: 0 }],
        currentRound: 0, totalRounds: 5, question: null, answeredIds: [], deadline: null,
        expiresAt: Date.now() + 3_600_000, winnerId: null, ...overrides,
    });
    await ref.collection("secret").doc("game").set({
        rounds: Array.from({ length: 5 }, () => ({ question, secret: { championId: "Ahri" } })), answers: {},
    });
    return ref;
};

const firestore = (path) => `http://${process.env.FIRESTORE_EMULATOR_HOST}/v1/projects/${projectId}/databases/(default)/documents/${path}`;
const readAs = (path, player) => fetch(firestore(path), { headers: { Authorization: `Bearer ${player.token}` } });

before(async () => {
    if (process.env.FIREBASE_EMULATOR_HUB) {
        assert.match(process.env.FIREBASE_EMULATOR_HUB, /^(127\.0\.0\.1|localhost):\d+$/);
        const running = await (await fetch(`http://${process.env.FIREBASE_EMULATOR_HUB}/emulators`)).json();
        assert.ok(running.functions?.port, "The Functions emulator must be running.");
        functionsHost = `127.0.0.1:${running.functions.port}`;
    }
    for (let i = 0; i < 3; i += 1) {
        const response = await fetch(`http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=test-key`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: `test-${randomUUID()}@example.com`, password: "local-test-password", returnSecureToken: true }),
        });
        const account = await response.json();
        assert.ok(account.idToken, JSON.stringify(account));
        players.push({ uid: account.localId, token: account.idToken });
        refs.push(db.collection("pvpQueue").doc(account.localId));
    }
});

beforeEach(async () => {
    await Promise.all(players.map((player, i) => profile(player).set({ username: `Test ${i}`, avatar: null, scores: {}, totalScore: 0 })));
    await Promise.all(players.map((player) => ticket(player).delete()));
});

after(async () => {
    for (const ref of refs) await db.recursiveDelete(ref);
    for (const player of players) {
        await profile(player).delete();
        await admin.auth().deleteUser(player.uid);
    }
    await admin.app().delete();
});

test("solo: concurrent winning requests and retries award points once", async () => {
    const ref = await solo();
    const results = await Promise.all(Array.from({ length: 4 }, () => call("submitGuess", { roundId: ref.id, guess: "Ahri" })));
    results.forEach((result) => assert.equal(result.points, 10));
    assert.equal((await score()).totalScore, 10);
    assert.equal((await score()).scores.Skills, 10);
    assert.equal((await ref.get()).data().finished, true);
    await assert.rejects(call("submitGuess", { roundId: ref.id, guess: "Ashe" }), { code: "FAILED_PRECONDITION" });
});

test("solo: simultaneous wrong guesses are not lost", async () => {
    const ref = await solo();
    await Promise.all(["Ashe", "Akali"].map((guess) => call("submitGuess", { roundId: ref.id, guess })));
    assert.equal((await ref.get()).data().wrongGuesses, 2);
    const result = await call("submitGuess", { roundId: ref.id, guess: "Ahri" });
    assert.equal(result.points, 3);
    assert.equal((await score()).totalScore, 3);
});

test("solo: Hangman keeps letter points and its win bonus", async () => {
    const ref = await solo("Hangman", { question: { mask: ["", "", "", ""] } });
    for (const guess of "AHR") {
        const result = await call("submitGuess", { roundId: ref.id, guess });
        assert.equal(result.finished, false);
        assert.equal(result.answer, null);
    }
    const result = await call("submitGuess", { roundId: ref.id, guess: "I" });
    assert.equal(result.points, 14);
    assert.equal((await score()).scores.Hangman, 14);
});

test("solo: Regions counts attempts and losses award no points", async () => {
    const ref = await solo("Regions");
    for (const guess of ["noxus", "demacia", "freljord"]) await call("submitGuess", { roundId: ref.id, guess });
    assert.equal((await ref.get()).data().finished, true);
    assert.equal((await score()).totalScore, 0);
    const win = await solo("Regions");
    await call("submitGuess", { roundId: win.id, guess: "noxus" });
    await call("submitGuess", { roundId: win.id, guess: "ionia" });
    assert.equal((await score()).scores.Regions, 6);
});

test("solo: deleted profiles are not recreated by a late answer", async () => {
    const ref = await solo();
    await profile(players[0]).delete();
    await call("submitGuess", { roundId: ref.id, guess: "Ahri" });
    assert.equal((await profile(players[0]).get()).exists, false);
});

test("solo: authentication, ownership and input validation", async () => {
    const ref = await solo();
    await assert.rejects(call("submitGuess", { roundId: ref.id, guess: "Ahri" }, null), { code: "UNAUTHENTICATED" });
    await assert.rejects(call("submitGuess", { roundId: ref.id, guess: "Ahri" }, players[1]), { code: "PERMISSION_DENIED" });
    await assert.rejects(call("submitGuess", { roundId: {}, guess: "Ahri" }), { code: "INVALID_ARGUMENT" });
    await assert.rejects(call("startRound", { gameId: "constructor" }), { code: "INVALID_ARGUMENT" });
    await assert.rejects(call("submitGuess", { roundId: ref.id, guess: "Teemo" }), { code: "INVALID_ARGUMENT" });
});

test("rules: clients cannot read solo answers or edit scores", async () => {
    const ref = await solo();
    assert.equal((await readAs(`rounds/${ref.id}/secret/answer`, players[0])).status, 403);
    const response = await fetch(firestore(`scores/${players[0].uid}`), {
        method: "PATCH", headers: { Authorization: `Bearer ${players[0].token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ fields: { totalScore: { integerValue: "9999" }, scores: { mapValue: { fields: {} } } } }),
    });
    assert.equal(response.status, 403);
});

test("pvp: only two distinct players can join, even concurrently", async () => {
    const ref = await room();
    await call("joinPvpRoom", { code: ref.id });
    assert.equal((await ref.get()).data().status, "waiting");
    const results = await Promise.allSettled(players.slice(1).map((player) => call("joinPvpRoom", { code: ref.id }, player)));
    assert.equal(results.filter((result) => result.status === "fulfilled").length, 1);
    assert.equal((await ref.get()).data().playerIds.length, 2);
});

test("pvp: private matches keep their scores out of both rankings", async () => {
    const ref = await room();
    await call("joinPvpRoom", { code: ref.id }, players[1]);
    for (let round = 0; round < 5; round += 1) {
        await call("submitPvpAnswer", { code: ref.id, round, guess: "Ahri" });
        await call("submitPvpAnswer", { code: ref.id, round, guess: "Ashe" });
        const waiting = (await ref.get()).data();
        assert.equal(waiting.players[0].score, round * 10);
        assert.equal(waiting.answeredIds.length, 1);
        assert.equal(waiting.answers, undefined);
        await call("submitPvpAnswer", { code: ref.id, round, guess: round === 0 ? "Ahri" : "Ashe" }, players[1]);
    }
    const completed = (await ref.get()).data();
    assert.equal(completed.status, "finished");
    assert.equal(completed.winnerId, players[0].uid);
    assert.equal(completed.question, null);
    assert.equal((await score()).scores.PVP, undefined);
    assert.equal((await score(players[1])).scores.PVP, undefined);
    await assert.rejects(call("submitPvpAnswer", { code: ref.id, round: 4, guess: "Ahri" }), { code: "FAILED_PRECONDITION" });
    assert.equal((await score()).totalScore, 0);
});

test("pvp: simultaneous final answers produce a draw without duplicate points", async () => {
    const ref = await room();
    await call("joinPvpRoom", { code: ref.id }, players[1]);
    await ref.update({ currentRound: 4 });
    await Promise.allSettled([...players.slice(0, 2), ...players.slice(0, 2)].map((player) => call("submitPvpAnswer", { code: ref.id, round: 4, guess: "Ahri" }, player)));
    assert.equal((await ref.get()).data().winnerId, null);
    assert.equal((await ref.get()).data().status, "finished");
    assert.equal((await score()).totalScore, 0);
    assert.equal((await score(players[1])).totalScore, 0);
});

test("pvp: timeouts count missing answers as wrong and advance only once", async () => {
    const ref = await room();
    await call("joinPvpRoom", { code: ref.id }, players[1]);
    await assert.rejects(call("advancePvpRound", { code: ref.id, round: 0 }), { code: "FAILED_PRECONDITION" });
    await call("submitPvpAnswer", { code: ref.id, round: 0, guess: "Ahri" });
    await ref.update({ deadline: Date.now() - 1000 });
    await assert.rejects(call("submitPvpAnswer", { code: ref.id, round: 0, guess: "Ahri" }, players[1]), { code: "DEADLINE_EXCEEDED" });
    const results = await Promise.allSettled(players.slice(0, 2).map((player) => call("advancePvpRound", { code: ref.id, round: 0 }, player)));
    assert.equal(results.filter((result) => result.status === "fulfilled").length, 1);
    const next = (await ref.get()).data();
    assert.equal(next.currentRound, 1);
    assert.deepEqual(next.players.map((player) => player.score), [10, 0]);
});

test("pvp: leaving cancels the match without ranking points", async () => {
    const ref = await room();
    await call("joinPvpRoom", { code: ref.id }, players[1]);
    await call("leavePvpRoom", { code: ref.id });
    await call("leavePvpRoom", { code: ref.id });
    assert.equal((await ref.get()).data().status, "cancelled");
    await assert.rejects(call("submitPvpAnswer", { code: ref.id, round: 0, guess: "Ahri" }, players[1]), { code: "FAILED_PRECONDITION" });
    assert.equal((await score()).totalScore, 0);
});

test("pvp: expired rooms reject new players", async () => {
    const ref = await room({ expiresAt: Date.now() - 1000 });
    await assert.rejects(call("joinPvpRoom", { code: ref.id }, players[1]), { code: "FAILED_PRECONDITION" });
});

test("pvp: an invalid public username cannot break the opponent's room", async () => {
    const ref = await room();
    await profile(players[1]).update({ username: { invalid: true } });
    await call("joinPvpRoom", { code: ref.id }, players[1]);
    assert.equal((await ref.get()).data().players[1].name, "Player");
});

test("rules: participants see the room but no one can read answers or write match state", async () => {
    const ref = await room();
    assert.equal((await readAs(`pvpRooms/${ref.id}`, players[0])).status, 200);
    assert.equal((await readAs(`pvpRooms/${ref.id}`, players[2])).status, 403);
    assert.equal((await readAs(`pvpRooms/${ref.id}/secret/game`, players[0])).status, 403);
    await assert.rejects(call("submitPvpAnswer", { code: ref.id, round: 0, guess: "Ahri" }, players[2]), { code: "PERMISSION_DENIED" });
    await assert.rejects(call("leavePvpRoom", { code: ref.id }, players[2]), { code: "PERMISSION_DENIED" });
    const response = await fetch(firestore(`pvpRooms/${ref.id}`), {
        method: "PATCH", headers: { Authorization: `Bearer ${players[0].token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ fields: { status: { stringValue: "finished" } } }),
    });
    assert.equal(response.status, 403);
    await call("joinPvpRoom", { code: ref.id }, players[1]);
    assert.equal((await readAs(`pvpRooms/${ref.id}`, players[1])).status, 200);
});

test("queue: waiting players renew their lease without matching themselves", async () => {
    const searchId = randomUUID();
    assert.equal((await findOpponent(players[0], searchId)).state, "waiting");
    const first = (await ticket(players[0]).get()).data();
    assert.equal((await findOpponent(players[0], searchId)).state, "waiting");
    const renewed = (await ticket(players[0]).get()).data();
    assert.ok(renewed.expiresAt >= first.expiresAt);
    await assert.rejects(findOpponent(players[0], randomUUID()), { code: "already-exists" });
});

const rankedRoom = async (overrides = {}) => {
    const ref = await room();
    await call("joinPvpRoom", { code: ref.id }, players[1]);
    await ref.update({ mode: "ranked", lastSeen: Object.fromEntries(players.slice(0, 2).map((player) => [player.uid, Date.now()])), ...overrides });
    return ref;
};

test("ranked: a win awards 20 once and a loss is floored without spending solo points", async () => {
    await profile(players[0]).update({ scores: { PVP: 40, Skills: 100 }, totalScore: 140 });
    await profile(players[1]).update({ scores: { PVP: 8, Skills: 100 }, totalScore: 108 });
    const ref = await rankedRoom({ currentRound: 4 });
    await call("submitPvpAnswer", { code: ref.id, round: 4, guess: "Ahri" });
    await Promise.allSettled(Array.from({ length: 4 }, () => call("submitPvpAnswer", { code: ref.id, round: 4, guess: "Ashe" }, players[1])));
    assert.equal((await score()).scores.PVP, 60);
    assert.equal((await score()).totalScore, 160);
    assert.equal((await score(players[1])).scores.PVP, 0);
    assert.equal((await score(players[1])).scores.Skills, 100);
    assert.equal((await score(players[1])).totalScore, 100);
    assert.deepEqual((await ref.get()).data().rankingChanges, { [players[0].uid]: 20, [players[1].uid]: -8 });
    await call("leavePvpRoom", { code: ref.id });
    assert.equal((await score()).scores.PVP, 60);
});

test("ranked: draws leave both rankings unchanged", async () => {
    const ref = await rankedRoom({ currentRound: 4 });
    await Promise.all(players.slice(0, 2).map((player) => call("submitPvpAnswer", { code: ref.id, round: 4, guess: "Ahri" }, player)));
    assert.equal((await ref.get()).data().winnerId, null);
    for (const player of players.slice(0, 2)) assert.equal((await score(player)).totalScore, 0);
});

test("ranked: leaving forfeits regardless of the current score and cannot award twice", async () => {
    await profile(players[0]).update({ scores: { PVP: 30 }, totalScore: 30 });
    const ref = await rankedRoom({ players: [
        { uid: players[0].uid, name: "Host", score: 40 }, { uid: players[1].uid, name: "Guest", score: 0 },
    ] });
    await Promise.all(Array.from({ length: 3 }, () => call("leavePvpRoom", { code: ref.id })));
    assert.equal((await score()).scores.PVP, 10);
    assert.equal((await score(players[1])).scores.PVP, 20);
    assert.equal((await ref.get()).data().winnerId, players[1].uid);
    assert.equal((await ref.get()).data().endReason, "forfeit");
});

test("ranked: reconnecting before the grace deadline renews presence, but a late return loses", async () => {
    const ref = await rankedRoom();
    await ref.update({ [`lastSeen.${players[0].uid}`]: Date.now() - 30_000 });
    await call("heartbeatPvpRoom", { code: ref.id });
    assert.ok((await ref.get()).data().lastSeen[players[0].uid] > Date.now() - 5000);
    await ref.update({ [`lastSeen.${players[0].uid}`]: Date.now() - 61_000 });
    await Promise.all(players.slice(0, 2).map((player) => call("heartbeatPvpRoom", { code: ref.id }, player)));
    assert.equal((await ref.get()).data().winnerId, players[1].uid);
    assert.equal((await ref.get()).data().endReason, "disconnect");
    assert.equal((await score(players[1])).scores.PVP, 20);
    await assert.rejects(call("heartbeatPvpRoom", { code: ref.id }, players[2]), { code: "PERMISSION_DENIED" });
    await assert.rejects(call("heartbeatPvpRoom", { code: ref.id }, null), { code: "UNAUTHENTICATED" });
});

test("ranked: simultaneous abandonment is settled on the next queue request", async () => {
    const firstId = randomUUID();
    await findOpponent(players[0], firstId);
    const paired = await findOpponent(players[1], randomUUID());
    await Promise.all(players.slice(0, 2).map((player) => profile(player).update({ scores: { PVP: 40 }, totalScore: 40 })));
    const ref = db.collection("pvpRooms").doc(paired.code);
    await ref.update({ lastSeen: Object.fromEntries(players.slice(0, 2).map((player) => [player.uid, Date.now() - 61_000])) });
    assert.equal((await findOpponent(players[0], firstId)).state, "cancelled");
    assert.equal((await ref.get()).data().endReason, "abandoned");
    for (const player of players.slice(0, 2)) assert.equal((await score(player)).scores.PVP, 20);
    assert.equal((await findOpponent(players[0], randomUUID())).state, "waiting");
});

test("ranked: missing profiles are not recreated and old rooms remain unranked", async () => {
    const ranked = await rankedRoom();
    await profile(players[1]).delete();
    await call("leavePvpRoom", { code: ranked.id });
    assert.equal((await profile(players[1]).get()).exists, false);
    const legacy = await room();
    await profile(players[1]).set({ username: "Guest", scores: {}, totalScore: 0 });
    await call("joinPvpRoom", { code: legacy.id }, players[1]);
    await legacy.update({ mode: admin.firestore.FieldValue.delete(), currentRound: 4 });
    await call("submitPvpAnswer", { code: legacy.id, round: 4, guess: "Ahri" });
    await call("submitPvpAnswer", { code: legacy.id, round: 4, guess: "Ashe" }, players[1]);
    assert.equal((await score()).totalScore, 0);
});

test("queue: three simultaneous players form exactly one match", async () => {
    const searchIds = players.map(() => randomUUID());
    await findOpponent(players[0], searchIds[0]);
    await Promise.all(players.slice(1).map((player, index) => findOpponent(player, searchIds[index + 1])));
    const entries = await Promise.all(players.map(async (player) => (await ticket(player).get()).data()));
    const paired = entries.filter((entry) => entry.state === "matched");
    assert.equal(paired.length, 2);
    assert.equal(paired[0].code, paired[1].code);
    assert.equal(entries.filter((entry) => entry.state === "waiting").length, 1);
    const game = (await db.collection("pvpRooms").doc(paired[0].code).get()).data();
    assert.equal(game.status, "playing");
    assert.equal(game.mode, "ranked");
    assert.equal(new Set(game.playerIds).size, 2);
    assert.equal(game.question.spellName, question.spellName);
    const pairedIndex = entries.findIndex((entry) => entry.state === "matched");
    assert.equal((await findOpponent(players[pairedIndex], randomUUID())).code, paired[0].code);
});

test("queue: offline entries are excluded from matchmaking", async () => {
    await ticket(players[0]).set({ state: "waiting", searchId: randomUUID(), expiresAt: Date.now() - 1, code: null });
    const result = await findOpponent(players[1], randomUUID(), async () => { throw new Error("No questions should be loaded"); });
    assert.equal(result.state, "waiting");
});

test("queue: cancelling before enrollment prevents a delayed request from rejoining", async () => {
    const searchId = randomUUID();
    await cancelSearch(players[0].uid, searchId);
    assert.equal((await findOpponent(players[0], searchId)).state, "cancelled");
    const newId = randomUUID();
    assert.equal((await findOpponent(players[0], newId)).state, "waiting");
    await cancelSearch(players[0].uid, searchId);
    assert.equal((await ticket(players[0]).get()).data().state, "waiting");
    assert.equal((await ticket(players[0]).get()).data().searchId, newId);
});

test("queue: a player who cancels while questions load is not paired", async () => {
    const firstId = randomUUID();
    await findOpponent(players[0], firstId);
    let release;
    let started;
    const ready = new Promise((resolve) => { started = resolve; });
    const gate = new Promise((resolve) => { release = resolve; });
    const pending = findOpponent(players[1], randomUUID(), async () => {
        started();
        await gate;
        return loadMatchQuestions();
    });
    await ready;
    await cancelSearch(players[0].uid, firstId);
    release();
    assert.equal((await pending).state, "waiting");
    assert.equal((await ticket(players[0]).get()).data().state, "cancelled");
});

test("queue: a committed match wins over cancellation and can be resumed", async () => {
    const firstId = randomUUID();
    await findOpponent(players[0], firstId);
    const paired = await findOpponent(players[1], randomUUID());
    assert.equal(paired.state, "matched");
    assert.equal((await cancelSearch(players[0].uid, firstId)).code, paired.code);
    assert.equal((await findOpponent(players[0], firstId)).code, paired.code);
    await db.collection("pvpRooms").doc(paired.code).update({ status: "finished" });
    assert.equal((await findOpponent(players[0], firstId)).state, "cancelled");
    assert.equal((await findOpponent(players[0], randomUUID())).state, "waiting");
});

test("queue: failed question loading leaves both players eligible for retry", async () => {
    await findOpponent(players[0], randomUUID());
    const secondId = randomUUID();
    await assert.rejects(findOpponent(players[1], secondId, async () => { throw new Error("offline"); }));
    assert.equal((await ticket(players[0]).get()).data().state, "waiting");
    assert.equal((await findOpponent(players[1], secondId)).state, "matched");
});

test("queue: callable authentication, validation and private queue rules", async () => {
    await assert.rejects(call("findPvpMatch", { searchId: randomUUID() }, null), { code: "UNAUTHENTICATED" });
    await assert.rejects(call("findPvpMatch", { searchId: "bad" }), { code: "INVALID_ARGUMENT" });
    await call("findPvpMatch", { searchId: randomUUID() });
    assert.equal((await readAs(`pvpQueue/${players[0].uid}`, players[0])).status, 200);
    assert.equal((await readAs(`pvpQueue/${players[0].uid}`, players[1])).status, 403);
    assert.equal((await readAs("pvpQueue", players[0])).status, 403);
    const response = await fetch(firestore(`pvpQueue/${players[0].uid}`), {
        method: "PATCH", headers: { Authorization: `Bearer ${players[0].token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ fields: { state: { stringValue: "matched" } } }),
    });
    assert.equal(response.status, 403);
});

test("pvp: mixed questions accept generic answer ids and finish through the same ranking rules", async () => {
    const ref = await rankedRoom();
    const rounds = ["Regions", "Items", "Lore", "Champions", "Summoner spells"].map((category, index) => ({
        question: {
            category, prompt: "Test question " + index, image: null, text: null, dataVersion: "test",
            options: ["a", "b", "c", "d"].map((id) => ({ id: index + "-" + id, name: "Answer " + id })),
        },
        secret: { answerId: index + "-a" },
    }));
    await ref.collection("secret").doc("game").set({ rounds, answers: {} });
    await ref.update({ question: rounds[0].question });
    await assert.rejects(call("submitPvpAnswer", { code: ref.id, round: 0, guess: "not-offered" }), { code: "INVALID_ARGUMENT" });
    for (let index = 0; index < rounds.length; index += 1) {
        assert.deepEqual((await ref.get()).data().question, rounds[index].question);
        await call("submitPvpAnswer", { code: ref.id, round: index, guess: index + "-a" });
        await call("submitPvpAnswer", { code: ref.id, round: index, guess: index + "-b" }, players[1]);
    }
    assert.equal((await ref.get()).data().players[0].score, 50);
    assert.equal((await score()).scores.PVP, 20);
    assert.equal((await score(players[1])).scores.PVP, 0);
});

test("live: online players complete the same mixed quiz and receive ranked rewards", async () => {
    const region = db.collection("championRegions").doc("Ahri");
    refs.push(region);
    await region.set({ region: "Ionia" });
    const firstId = randomUUID();
    assert.equal((await call("findPvpMatch", { searchId: firstId })).state, "waiting");
    const paired = await call("findPvpMatch", { searchId: randomUUID() }, players[1]);
    assert.equal(paired.state, "matched");
    const ref = db.collection("pvpRooms").doc(paired.code);
    refs.push(ref);
    assert.equal((await call("findPvpMatch", { searchId: firstId })).code, paired.code);
    const secret = (await ref.collection("secret").doc("game").get()).data();
    assert.equal(new Set(secret.rounds.map((round) => round.question.category)).size, 5);
    assert.equal(new Set(secret.rounds.map((round) => round.question.dataVersion)).size, 1);
    for (let index = 0; index < secret.rounds.length; index += 1) {
        const { question, secret: solution } = secret.rounds[index];
        assert.deepEqual((await ref.get()).data().question, question);
        assert.equal(question.answerId, undefined);
        if (question.image) {
            const asset = await fetch(question.image, { method: "HEAD", signal: AbortSignal.timeout(5000) });
            assert.equal(asset.status, 200, question.image);
        }
        const wrong = question.options.find((option) => option.id !== solution.answerId).id;
        await call("submitPvpAnswer", { code: paired.code, round: index, guess: solution.answerId });
        await call("submitPvpAnswer", { code: paired.code, round: index, guess: wrong }, players[1]);
    }
    assert.equal((await ref.get()).data().status, "finished");
    assert.equal((await score()).scores.PVP, 20);
    assert.equal((await score(players[1])).scores.PVP, 0);
});

test("live: all solo modes start and complete against Data Dragon", async () => {
    const regionRef = db.collection("championRegions").doc(`test-${randomUUID()}`);
    refs.push(regionRef);
    await regionRef.set({ region: "Ionia" });
    for (const gameId of ["Skills", "Regions", "Hangman"]) {
        const started = await call("startRound", { gameId });
        const ref = db.collection("rounds").doc(started.roundId);
        refs.push(ref);
        assert.equal(started.answer, undefined);
        const secret = (await ref.collection("secret").doc("answer").get()).data();
        const guesses = gameId === "Hangman" ? [...new Set(secret.name.replace(/[^A-Z]/g, ""))]
            : [gameId === "Skills" ? secret.championId : secret.region];
        let result;
        for (const guess of guesses) result = await call("submitGuess", { roundId: ref.id, guess });
        assert.equal(result.won, true);
        assert.equal(result.finished, true);
        assert.equal((await score()).scores[gameId], result.points);
    }
});

test("live: create, join and complete a real five-question PvP match", async () => {
    const { code } = await call("createPvpRoom", { mode: "ranked" });
    const ref = db.collection("pvpRooms").doc(code);
    refs.push(ref);
    assert.match(code, /^[A-F0-9]{6}$/);
    assert.equal((await ref.get()).data().mode, "private");
    await call("joinPvpRoom", { code }, players[1]);
    const { rounds } = (await ref.collection("secret").doc("game").get()).data();
    for (let round = 0; round < rounds.length; round += 1) {
        assert.deepEqual((await ref.get()).data().question, rounds[round].question);
        const guess = rounds[round].secret.answerId;
        await Promise.all(players.slice(0, 2).map((player) => call("submitPvpAnswer", { code, round, guess }, player)));
    }
    assert.equal((await ref.get()).data().status, "finished");
    assert.equal((await score()).scores.PVP, undefined);
    assert.equal((await score(players[1])).scores.PVP, undefined);
});
