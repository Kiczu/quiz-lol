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

const regionValues: Record<string, string> = {
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

const toRegionValue = (region: string): string | null =>
  regionValues[region.toLowerCase()] ?? null;

export const regions: GameHandler = {
  maxAttempts: 3,

  start: async () => {
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
  },

  assertGuess: (_round, guess) => {
    if (!Object.values(regionValues).includes(guess)) {
      throw new HttpsError("invalid-argument", "That region does not exist.");
    }
  },

  judge: (round, secret, guess) => {
    const correct = guess === secret.region;

    return {
      correct,
      solved: correct,
      points: correct ? scoreByWrongGuesses(round.wrongGuesses) : round.points,
    };
  },

  reveal: (secret) => secret.region as string,
};
