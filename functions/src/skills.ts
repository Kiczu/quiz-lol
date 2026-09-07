import { HttpsError } from "firebase-functions/v2/https";

import {
  Champion,
  ChampionDetails,
  DDRAGON,
  GameHandler,
  championIcon,
  loadRoster,
  pick,
  readJson,
  scoreByWrongGuesses,
  shuffle,
  spellIcon,
} from "./shared";

const optionsPerRound = 4;

export const skills: GameHandler = {
  maxAttempts: 3,

  start: async () => {
    const { version, champions } = await loadRoster();

    const answer = pick(champions);
    const details = await readJson<{ data: Record<string, ChampionDetails> }>(
      `${DDRAGON}/cdn/${version}/data/en_US/champion/${answer.id}.json`
    );
    const spell = pick(details.data[answer.id].spells);

    const distractors = shuffle(
      champions.filter((champion) => champion.id !== answer.id)
    ).slice(0, optionsPerRound - 1);

    return {
      question: {
        spellName: spell.name,
        spellIcon: spellIcon(spell.image.full, version),
        options: shuffle([answer, ...distractors]).map((champion) => ({
          id: champion.id,
          name: champion.name,
          icon: championIcon(champion.id, version),
        })),
      },
      secret: { championId: answer.id },
    };
  },

  assertGuess: (round, guess) => {
    const options = round.question.options as Champion[];
    if (!options.some((option) => option.id === guess)) {
      throw new HttpsError("invalid-argument", "That champion was not on offer.");
    }
  },

  judge: (round, secret, guess) => {
    const correct = guess === secret.championId;

    return {
      correct,
      solved: correct,
      points: correct ? scoreByWrongGuesses(round.wrongGuesses) : round.points,
    };
  },

  reveal: (secret) => secret.championId as string,
};
