import { FieldValue } from "firebase-admin/firestore";
import { setGlobalOptions } from "firebase-functions/v2";
import { HttpsError, onCall } from "firebase-functions/v2/https";

import { hangman } from "./hangman";
import { regions } from "./regions";
import { skills } from "./skills";
import { GameHandler, Round, awardPoints, db, requireUid } from "./shared";

setGlobalOptions({ region: "europe-west1", maxInstances: 10 });

const handlers: Record<string, GameHandler> = {
  Skills: skills,
  Regions: regions,
  Hangman: hangman,
};

const handlerFor = (gameId?: string) => {
  const handler = gameId ? handlers[gameId] : undefined;

  if (!handler) {
    throw new HttpsError("invalid-argument", "Unknown game.");
  }

  return handler;
};

export const startRound = onCall(async (request) => {
  const uid = requireUid(request.auth?.uid);
  const { gameId } = (request.data ?? {}) as { gameId?: string };
  const handler = handlerFor(gameId);

  const { question, secret } = await handler.start();
  const round = db.collection("rounds").doc();

  await round.set({
    uid,
    gameId,
    question,
    wrongGuesses: 0,
    used: [],
    points: 0,
    finished: false,
    createdAt: FieldValue.serverTimestamp(),
  });
  await round.collection("secret").doc("answer").set(secret);

  return { roundId: round.id, maxAttempts: handler.maxAttempts, ...question };
});

export const submitGuess = onCall(async (request) => {
  const uid = requireUid(request.auth?.uid);
  const { roundId, guess } = (request.data ?? {}) as {
    roundId?: string;
    guess?: string;
  };

  if (!roundId || !guess) {
    throw new HttpsError("invalid-argument", "roundId and guess are required.");
  }

  const roundRef = db.collection("rounds").doc(roundId);
  const roundSnap = await roundRef.get();
  const round = roundSnap.data() as Round | undefined;

  if (!round) {
    throw new HttpsError("not-found", "That round does not exist.");
  }
  if (round.uid !== uid) {
    throw new HttpsError("permission-denied", "That round belongs to someone else.");
  }
  if (round.finished) {
    throw new HttpsError("failed-precondition", "That round is already over.");
  }

  const handler = handlerFor(round.gameId);
  handler.assertGuess(round, guess);

  if (round.used.includes(guess)) {
    return {
      correct: false,
      won: false,
      finished: false,
      wrongGuesses: round.wrongGuesses,
      points: round.points,
      mask: null,
      answer: null,
    };
  }

  const secretSnap = await roundRef.collection("secret").doc("answer").get();
  const secret = secretSnap.data() ?? {};
  const judgement = handler.judge(round, secret, guess);

  const wrongGuesses = judgement.correct ? round.wrongGuesses : round.wrongGuesses + 1;
  const finished = judgement.solved || wrongGuesses >= handler.maxAttempts;

  await roundRef.update({
    used: [...round.used, guess],
    wrongGuesses,
    points: judgement.points,
    finished,
  });

  if (finished) {
    await awardPoints(uid, round.gameId, judgement.points);
  }

  return {
    correct: judgement.correct,
    won: judgement.solved,
    finished,
    wrongGuesses,
    points: judgement.points,
    mask: judgement.mask ?? null,
    answer: finished ? handler.reveal(secret) : null,
  };
});
