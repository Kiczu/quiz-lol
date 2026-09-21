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
        status: "waiting", playerIds: [players[0].uid],
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
    }
});

beforeEach(async () => {
    await Promise.all(players.map((player, i) => profile(player).set({ username: `Test ${i}`, avatar: null, scores: {}, totalScore: 0 })));
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

test("pvp: five rounds finish once and both scores reach PVP ranking", async () => {
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
    assert.equal((await score()).scores.PVP, 50);
    assert.equal((await score(players[1])).scores.PVP, 10);
    await assert.rejects(call("submitPvpAnswer", { code: ref.id, round: 4, guess: "Ahri" }), { code: "FAILED_PRECONDITION" });
    assert.equal((await score()).totalScore, 50);
});

test("pvp: simultaneous final answers produce a draw without duplicate points", async () => {
    const ref = await room();
    await call("joinPvpRoom", { code: ref.id }, players[1]);
    await ref.update({ currentRound: 4 });
    await Promise.allSettled([...players.slice(0, 2), ...players.slice(0, 2)].map((player) => call("submitPvpAnswer", { code: ref.id, round: 4, guess: "Ahri" }, player)));
    assert.equal((await ref.get()).data().winnerId, null);
    assert.equal((await ref.get()).data().status, "finished");
    assert.equal((await score()).totalScore, 10);
    assert.equal((await score(players[1])).totalScore, 10);
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
    const { code } = await call("createPvpRoom", {});
    const ref = db.collection("pvpRooms").doc(code);
    refs.push(ref);
    assert.match(code, /^[A-F0-9]{6}$/);
    await call("joinPvpRoom", { code }, players[1]);
    const { rounds } = (await ref.collection("secret").doc("game").get()).data();
    for (let round = 0; round < rounds.length; round += 1) {
        assert.equal((await ref.get()).data().question.spellName, rounds[round].question.spellName);
        const guess = rounds[round].secret.championId;
        await Promise.all(players.slice(0, 2).map((player) => call("submitPvpAnswer", { code, round, guess }, player)));
    }
    assert.equal((await ref.get()).data().status, "finished");
    assert.equal((await score()).scores.PVP, 50);
    assert.equal((await score(players[1])).scores.PVP, 50);
});
