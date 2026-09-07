import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { HttpsError } from "firebase-functions/v2/https";

admin.initializeApp();

export const db = admin.firestore();

export const DDRAGON = "https://ddragon.leagueoflegends.com";

export type Champion = { id: string; name: string };

export type ChampionDetails = {
  spells: { name: string; image: { full: string } }[];
};

export type Round = {
  uid: string;
  gameId: string;
  question: Record<string, unknown>;
  wrongGuesses: number;
  used: string[];
  points: number;
  finished: boolean;
};

export type Secret = Record<string, unknown>;

export type Judgement = {
  correct: boolean;
  solved: boolean;
  points: number;
  mask?: string[];
};

export type GameHandler = {
  maxAttempts: number;
  start: () => Promise<{ question: Record<string, unknown>; secret: Secret }>;
  assertGuess: (round: Round, guess: string) => void;
  judge: (round: Round, secret: Secret, guess: string) => Judgement;
  reveal: (secret: Secret) => string;
};

export const readJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new HttpsError("unavailable", `Data Dragon replied ${response.status}.`);
  }
  return (await response.json()) as T;
};

let roster: { version: string; champions: Champion[] } | null = null;

export const loadRoster = async () => {
  if (!roster) {
    const versions = await readJson<string[]>(`${DDRAGON}/api/versions.json`);
    const version = versions[0];
    const payload = await readJson<{ data: Record<string, Champion> }>(
      `${DDRAGON}/cdn/${version}/data/en_US/champion.json`
    );
    roster = { version, champions: Object.values(payload.data) };
  }

  return roster;
};

export const championIcon = (championId: string, version: string) =>
  `${DDRAGON}/cdn/${version}/img/champion/${championId}.png`;

export const spellIcon = (spellImage: string, version: string) =>
  `${DDRAGON}/cdn/${version}/img/spell/${spellImage}`;

const toSlug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

export const findByLabel = (champions: Champion[], label: string) => {
  const slug = toSlug(label);
  return (
    champions.find(
      (champion) => toSlug(champion.id) === slug || toSlug(champion.name) === slug
    ) ?? null
  );
};

export const pick = <T>(items: T[]) => items[Math.floor(Math.random() * items.length)];

export const shuffle = <T>(items: T[]) => {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

export const scoreByWrongGuesses = (wrongGuesses: number) => {
  if (wrongGuesses === 0) return 10;
  if (wrongGuesses === 1) return 6;
  if (wrongGuesses === 2) return 3;
  return 0;
};

export const requireUid = (uid?: string) => {
  if (!uid) {
    throw new HttpsError("unauthenticated", "Sign in to play.");
  }
  return uid;
};

export const awardPoints = async (uid: string, gameId: string, points: number) => {
  if (points <= 0) return;

  await db
    .collection("scores")
    .doc(uid)
    .set(
      {
        totalScore: FieldValue.increment(points),
        scores: { [gameId]: FieldValue.increment(points) },
      },
      { merge: true }
    );
};
