import { HttpsError } from "firebase-functions/v2/https";

import { GameHandler, loadRoster, pick } from "./shared";

const winBonus = 10;

const isLetter = (char: string) => /[A-Z]/.test(char);

const maskFor = (name: string, used: string[]) =>
  name
    .split("")
    .map((char) => (!isLetter(char) || used.includes(char) ? char : ""));

const start: GameHandler["start"] = async () => {
  const { champions } = await loadRoster();
  const name = pick(champions).name.toUpperCase();

  return {
    question: { mask: maskFor(name, []) },
    secret: { name },
  };
};

const assertGuess: GameHandler["assertGuess"] = (_round, guess) => {
  if (!/^[A-Z]$/.test(guess)) {
    throw new HttpsError("invalid-argument", "Guess a single letter.");
  }
};

const judge: GameHandler["judge"] = (round, secret, guess) => {
  const name = secret.name as string;
  const mask = maskFor(name, [...round.used, guess]);
  const correct = name.includes(guess);
  const solved = !mask.includes("");

  return {
    correct,
    solved,
    points: round.points + (correct ? 1 : 0) + (solved ? winBonus : 0),
    mask,
  };
};

const reveal: GameHandler["reveal"] = (secret) => secret.name as string;

export const hangman: GameHandler = {
  maxAttempts: 6,
  start,
  assertGuess,
  judge,
  reveal,
};
