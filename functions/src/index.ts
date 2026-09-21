import { FieldValue } from "firebase-admin/firestore";
import { setGlobalOptions } from "firebase-functions/v2";
import { HttpsError, onCall } from "firebase-functions/v2/https";

import { hangman } from "./hangman";
import { regions } from "./regions";
import { skills } from "./skills";
import { GameHandler, GuessResult, Round, awardPoints, db, requireString, requireUid } from "./shared";

setGlobalOptions({ region: "europe-west1", maxInstances: 10 });

const handlers: Record<string, GameHandler> = {
  Skills: skills,
  Regions: regions,
  Hangman: hangman,
};

const handlerFor = (gameId: unknown) => {
  if (typeof gameId !== "string" || !Object.hasOwn(handlers, gameId)) {
    throw new HttpsError("invalid-argument", "Unknown game.");
  }
  return handlers[gameId];
};

export const startRound = onCall(async (request) => {
  const uid = requireUid(request.auth?.uid);
  const { gameId } = request.data ?? {};
  const handler = handlerFor(gameId);
  const profile = await db.collection("scores").doc(uid).get();
  if (!profile.exists) {
    throw new HttpsError("failed-precondition", "Create your profile before playing.");
  }

  const { question, secret } = await handler.start();
  const round = db.collection("rounds").doc();
  const batch = db.batch();
  batch.set(round, {
    uid,
    gameId,
    question,
    wrongGuesses: 0,
    used: [],
    points: 0,
    finished: false,
    results: {},
    createdAt: FieldValue.serverTimestamp(),
  });
  batch.set(round.collection("secret").doc("answer"), secret);
  await batch.commit();

  return { roundId: round.id, maxAttempts: handler.maxAttempts, ...question };
});

export const submitGuess = onCall(async (request) => {
  const uid = requireUid(request.auth?.uid);
  const roundId = requireString(request.data?.roundId, "roundId", /^[\w-]{1,128}$/);
  const guess = requireString(request.data?.guess, "guess", /^[\w-]{1,80}$/);
  const roundRef = db.collection("rounds").doc(roundId);

  return db.runTransaction(async (transaction) => {
    const roundSnap = await transaction.get(roundRef);
    const round = roundSnap.data() as Round | undefined;
    if (!round) throw new HttpsError("not-found", "That round does not exist.");
    if (round.uid !== uid) {
      throw new HttpsError("permission-denied", "That round belongs to someone else.");
    }
    if (round.results && Object.hasOwn(round.results, guess)) return round.results[guess];
    if (round.finished || round.used.includes(guess)) {
      throw new HttpsError("failed-precondition", "That guess is already resolved.");
    }

    const handler = handlerFor(round.gameId);
    handler.assertGuess(round, guess);
    const secretSnap = await transaction.get(roundRef.collection("secret").doc("answer"));
    const secret = secretSnap.data();
    if (!secret) throw new HttpsError("failed-precondition", "The round has no answer.");

    const judgement = handler.judge(round, secret, guess);
    const wrongGuesses = round.wrongGuesses + (judgement.correct ? 0 : 1);
    const finished = judgement.solved || wrongGuesses >= handler.maxAttempts;
    const profile = finished ? await transaction.get(db.collection("scores").doc(uid)) : null;
    const result: GuessResult = {
      correct: judgement.correct,
      won: judgement.solved,
      finished,
      wrongGuesses,
      points: judgement.points,
      mask: judgement.mask ?? null,
      answer: finished ? handler.reveal(secret) : null,
    };

    transaction.update(roundRef, {
      used: [...round.used, guess],
      wrongGuesses,
      points: judgement.points,
      finished,
      results: { ...round.results, [guess]: result },
    });
    if (profile) awardPoints(transaction, profile, round.gameId, judgement.points);
    return result;
  });
});
