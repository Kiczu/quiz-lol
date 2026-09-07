import { httpsCallable } from "firebase/functions";

import { functions } from "../api/firebase/functions";

export type ChampionOption = {
    id: string;
    name: string;
    icon: string;
};

type RoundBase = {
    roundId: string;
    maxAttempts: number;
};

export type SkillRound = RoundBase & {
    spellName: string;
    spellIcon: string;
    options: ChampionOption[];
};

export type RegionRound = RoundBase & {
    championName: string;
    championIcon: string | null;
};

export type HangmanRound = RoundBase & {
    mask: string[];
};

export type GuessResult = {
    correct: boolean;
    won: boolean;
    finished: boolean;
    wrongGuesses: number;
    points: number;
    mask: string[] | null;
    answer: string | null;
};

const callStartRound = httpsCallable<{ gameId: string }, unknown>(functions, "startRound");
const callSubmitGuess = httpsCallable<
    { roundId: string; guess: string },
    GuessResult
>(functions, "submitGuess");

const startRound = <T extends RoundBase>(gameId: string) =>
    callStartRound({ gameId }).then((result) => result.data as T);

const submitGuess = (roundId: string, guess: string) =>
    callSubmitGuess({ roundId, guess }).then((result) => result.data);

export const gameRoundService = {
    startRound,
    submitGuess,
};
