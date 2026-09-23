import { HttpsError } from "firebase-functions/v2/https";

import {
  GameHandler,
  championIcon,
  db,
  findByLabel,
  loadRoster,
  pick,
  scoreByWrongGuesses,
} from "./shared";

export const regionValues: Record<string, string> = {
  "bandle city": "bandle-city",
  bilgewater: "bilgewater",
  demacia: "demacia",
  freljord: "freljord",
  ionia: "ionia",
  ixtal: "ixtal",
  "mt. targon": "mt-targon",
  targon: "mt-targon",
  noxus: "noxus",
  piltover: "piltover",
  "shadow isles": "shadow-isles",
  shurima: "shurima",
  "the void": "void",
  void: "void",
  zaun: "zaun",
};

export const toRegionValue = (region: string): string | null =>
  regionValues[region.toLowerCase()] ?? null;

const start: GameHandler["start"] = async () => {
  const { version, champions } = await loadRoster();
  const snapshot = await db.collection("championRegions").get();

  const entries = snapshot.docs
    .map((doc) => ({
      name: doc.id,
      region: toRegionValue(doc.data().region as string),
    }))
    .filter((entry): entry is { name: string; region: string } => entry.region !== null);

  if (entries.length === 0) {
    throw new HttpsError("unavailable", "No champion regions are configured.");
  }

  const answer = pick(entries);
  const matched = findByLabel(champions, answer.name);

  return {
    question: {
      championName: answer.name,
      championIcon: matched ? championIcon(matched.id, version) : null,
    },
    secret: { region: answer.region },
  };
};

const assertGuess: GameHandler["assertGuess"] = (_round, guess) => {
  if (!Object.values(regionValues).includes(guess)) {
    throw new HttpsError("invalid-argument", "That region does not exist.");
  }
};

const judge: GameHandler["judge"] = (round, secret, guess) => {
  const correct = guess === secret.region;

  return {
    correct,
    solved: correct,
    points: correct ? scoreByWrongGuesses(round.wrongGuesses) : round.points,
  };
};

const reveal: GameHandler["reveal"] = (secret) => secret.region as string;

export const regions: GameHandler = {
  maxAttempts: 3,
  start,
  assertGuess,
  judge,
  reveal,
};
