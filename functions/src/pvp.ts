import { randomBytes } from "node:crypto";

import { DocumentReference, Transaction } from "firebase-admin/firestore";
import { HttpsError, onCall } from "firebase-functions/v2/https";

import { awardPoints, db, requireString, requireUid } from "./shared";
import { skills } from "./skills";

const totalRounds = 5;
const roundDuration = 60_000;
const roomDuration = 60 * 60_000;
const options = { region: "europe-west1", maxInstances: 10 };

export const playerName = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim().slice(0, 40) : "Player";

type Question = {
  spellName: string;
  spellIcon: string;
  options: { id: string; name: string; icon: string }[];
};

type Player = { uid: string; name: string; score: number };
export type Room = {
  status: "waiting" | "playing" | "finished" | "cancelled";
  playerIds: string[];
  players: Player[];
  currentRound: number;
  totalRounds: number;
  question: Question | null;
  answeredIds: string[];
  deadline: number | null;
  expiresAt: number;
  winnerId: string | null;
};
export type RoomSecret = {
  rounds: { question: Question; secret: { championId: string } }[];
  answers: Record<string, string>;
};

export const loadPvpRounds = async () =>
  await Promise.all(Array.from({ length: totalRounds }, () => skills.start())) as RoomSecret["rounds"];

export const makePvpRoom = (players: Player[], question: Question | null = null): Room => ({
  status: question ? "playing" : "waiting",
  playerIds: players.map((player) => player.uid),
  players,
  currentRound: 0,
  totalRounds,
  question,
  answeredIds: [],
  deadline: question ? Date.now() + roundDuration : null,
  expiresAt: Date.now() + roomDuration,
  winnerId: null,
});

const roomRefFor = (value: unknown) => {
  const code = requireString(value, "room code", /^[A-F0-9]{6}$/);
  return db.collection("pvpRooms").doc(code);
};

const readRoom = async (transaction: Transaction, ref: DocumentReference, uid: string) => {
  const snap = await transaction.get(ref);
  const room = snap.data() as Room | undefined;
  if (!room) throw new HttpsError("not-found", "Room not found. Check the code.");
  if (!room.playerIds.includes(uid)) {
    throw new HttpsError("permission-denied", "Join this room before playing.");
  }
  return room;
};

const checkRound = (room: Room, round: unknown) => {
  if (room.expiresAt <= Date.now()) throw new HttpsError("failed-precondition", "This room has expired.");
  if (room.status !== "playing" || !Number.isInteger(round) || round !== room.currentRound) {
    throw new HttpsError("failed-precondition", "This round is no longer active.");
  }
};

const finishRound = async (
  transaction: Transaction,
  ref: DocumentReference,
  room: Room,
  secret: RoomSecret
) => {
  const answer = secret.rounds[room.currentRound].secret.championId;
  const players = room.players.map((player) => ({
    ...player,
    score: player.score + (secret.answers[player.uid] === answer ? 10 : 0),
  }));
  const nextRound = room.currentRound + 1;
  const finished = nextRound === room.totalRounds;
  const profiles = finished
    ? await transaction.getAll(...players.map((player) => db.collection("scores").doc(player.uid)))
    : [];

  transaction.update(ref, {
    players,
    status: finished ? "finished" : "playing",
    currentRound: finished ? room.currentRound : nextRound,
    question: finished ? null : secret.rounds[nextRound].question,
    answeredIds: [],
    deadline: finished ? null : Date.now() + roundDuration,
    winnerId: finished && players[0].score !== players[1].score
      ? (players[0].score > players[1].score ? players[0].uid : players[1].uid)
      : null,
  });
  transaction.update(ref.collection("secret").doc("game"), { answers: {} });
  profiles.forEach((profile, index) => awardPoints(transaction, profile, "PVP", players[index].score));
};

export const createPvpRoom = onCall(options, async (request) => {
  const uid = requireUid(request.auth?.uid);
  const profile = await db.collection("scores").doc(uid).get();
  if (!profile.exists) throw new HttpsError("failed-precondition", "Create your profile before playing.");
  const rounds = await loadPvpRounds();

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = randomBytes(3).toString("hex").toUpperCase();
    const ref = roomRefFor(code);
    const batch = db.batch();
    batch.create(ref, makePvpRoom([{ uid, name: playerName(profile.data()?.username), score: 0 }]));
    batch.create(ref.collection("secret").doc("game"), { rounds, answers: {} });
    try {
      await batch.commit();
      return { code };
    } catch (error) {
      if ((error as { code?: number }).code !== 6) throw error;
    }
  }
  throw new HttpsError("resource-exhausted", "Could not create a room. Try again.");
});

export const joinPvpRoom = onCall(options, async (request) => {
  const uid = requireUid(request.auth?.uid);
  const ref = roomRefFor(request.data?.code);
  return db.runTransaction(async (transaction) => {
    const snap = await transaction.get(ref);
    const room = snap.data() as Room | undefined;
    if (!room) throw new HttpsError("not-found", "Room not found. Check the code.");
    if (room.expiresAt <= Date.now()) throw new HttpsError("failed-precondition", "This room has expired.");
    if (room.playerIds.includes(uid)) return { code: ref.id };
    if (room.status !== "waiting" || room.playerIds.length !== 1) {
      throw new HttpsError("failed-precondition", "This room is no longer available.");
    }
    const profile = await transaction.get(db.collection("scores").doc(uid));
    if (!profile.exists) throw new HttpsError("failed-precondition", "Create your profile before playing.");
    const secret = (await transaction.get(ref.collection("secret").doc("game"))).data() as RoomSecret;
    transaction.update(ref, {
      status: "playing",
      playerIds: [...room.playerIds, uid],
      players: [...room.players, { uid, name: playerName(profile.data()?.username), score: 0 }],
      question: secret.rounds[0].question,
      deadline: Date.now() + roundDuration,
    });
    return { code: ref.id };
  });
});

export const submitPvpAnswer = onCall(options, async (request) => {
  const uid = requireUid(request.auth?.uid);
  const ref = roomRefFor(request.data?.code);
  const guess = requireString(request.data?.guess, "champion", /^[\w-]{1,80}$/);
  return db.runTransaction(async (transaction) => {
    const room = await readRoom(transaction, ref, uid);
    checkRound(room, request.data?.round);
    if (room.answeredIds.includes(uid)) return { accepted: true };
    if (Date.now() >= room.deadline!) throw new HttpsError("deadline-exceeded", "Time is up for this round.");
    if (!room.question?.options.some((option) => option.id === guess)) {
      throw new HttpsError("invalid-argument", "Choose one of the four champions.");
    }
    const secretRef = ref.collection("secret").doc("game");
    const secret = (await transaction.get(secretRef)).data() as RoomSecret;
    secret.answers = { ...secret.answers, [uid]: guess };
    if (room.answeredIds.length === 1) {
      await finishRound(transaction, ref, room, secret);
    } else {
      transaction.update(ref, { answeredIds: [uid] });
      transaction.update(secretRef, { answers: secret.answers });
    }
    return { accepted: true };
  });
});

export const advancePvpRound = onCall(options, async (request) => {
  const uid = requireUid(request.auth?.uid);
  const ref = roomRefFor(request.data?.code);
  await db.runTransaction(async (transaction) => {
    const room = await readRoom(transaction, ref, uid);
    checkRound(room, request.data?.round);
    if (Date.now() < room.deadline!) {
      throw new HttpsError("failed-precondition", "The other player still has time to answer.");
    }
    const secret = (await transaction.get(ref.collection("secret").doc("game"))).data() as RoomSecret;
    await finishRound(transaction, ref, room, secret);
  });
  return { advanced: true };
});

export const leavePvpRoom = onCall(options, async (request) => {
  const uid = requireUid(request.auth?.uid);
  const ref = roomRefFor(request.data?.code);
  await db.runTransaction(async (transaction) => {
    const room = await readRoom(transaction, ref, uid);
    if (room.status === "waiting" || room.status === "playing") {
      transaction.update(ref, { status: "cancelled", question: null, deadline: null });
    }
  });
  return { left: true };
});
