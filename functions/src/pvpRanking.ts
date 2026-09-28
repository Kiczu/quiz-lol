import { DocumentReference, FieldValue, Transaction } from "firebase-admin/firestore";

import type { Room } from "./pvp";
import { db } from "./shared";

const rankingStake = 20;
const reconnectWindow = 60_000;

export const finishMatch = async (
  transaction: Transaction,
  ref: DocumentReference,
  room: Room,
  winnerId: string | null,
  endReason: "score" | "forfeit" | "disconnect" | "abandoned"
): Promise<Room> => {
  const rankingChanges: Record<string, number> = Object.fromEntries(room.playerIds.map((uid) => [uid, 0]));
  if (room.mode === "ranked" && (winnerId || endReason === "abandoned")) {
    const profiles = await transaction.getAll(...room.playerIds.map((uid) => db.collection("scores").doc(uid)));
    for (const profile of profiles) {
      if (!profile.exists) continue;
      const previous = profile.data()?.scores?.PVP ?? 0;
      const next = Math.max(0, previous + (profile.id === winnerId ? rankingStake : -rankingStake));
      rankingChanges[profile.id] = next - previous;
      transaction.update(profile.ref, { "scores.PVP": next, totalScore: FieldValue.increment(next - previous) });
    }
  }
  const result = {
    status: "finished" as const, players: room.players, winnerId, endReason, rankingChanges,
    question: null, deadline: null, answeredIds: [],
  };
  transaction.update(ref, result);
  return { ...room, ...result };
};

export const resolveDisconnectedPlayers = async (
  transaction: Transaction,
  ref: DocumentReference,
  room: Room
): Promise<Room> => {
  if (room.mode !== "ranked" || room.status !== "playing") return room;
  const absent = room.playerIds.filter((uid) => Date.now() - (room.lastSeen?.[uid] ?? room.expiresAt) >= reconnectWindow);
  if (absent.length === 0) return room;
  const winnerId = absent.length === 1 ? room.playerIds.find((uid) => uid !== absent[0])! : null;
  return finishMatch(transaction, ref, room, winnerId, winnerId ? "disconnect" : "abandoned");
};
