import { DocumentReference, FieldValue, Timestamp, Transaction } from "firebase-admin/firestore";

import { pvpRules } from "./contracts/pvp";
import { db } from "./shared";

import type { Room } from "./pvp";

const { rankingStake, reconnectWindow, rematchCooldown } = pvpRules;

export const pvpPairRef = (playerIds: string[]) => db.collection("pvpPairs").doc([...playerIds].sort().join("_"));

export const isRecentPair = async (transaction: Transaction, playerIds: string[]) => {
  const pair = await transaction.get(pvpPairRef(playerIds));
  return (pair.data()?.rankedUntil?.toMillis() ?? 0) > Date.now();
};

export const finishMatch = async (
  transaction: Transaction,
  ref: DocumentReference,
  room: Room,
  winnerId: string | null,
  endReason: NonNullable<Room["endReason"]>
): Promise<Room> => {
  const rankingChanges: Record<string, number> = Object.fromEntries(room.playerIds.map((uid) => [uid, 0]));
  const stakes = room.mode === "ranked" && (winnerId || endReason === "abandoned");
  let unrankedReason = room.unrankedReason;
  if (stakes && !unrankedReason && room.currentRound === 0 && !room.nextRoundAt) unrankedReason = "early";
  if (stakes && !unrankedReason && await isRecentPair(transaction, room.playerIds)) unrankedReason = "rematch";
  if (stakes && !unrankedReason) {
    const profiles = await transaction.getAll(...room.playerIds.map((uid) => db.collection("scores").doc(uid)));
    for (const profile of profiles) {
      if (!profile.exists) continue;
      const previous = profile.data()?.scores?.PVP ?? 0;
      const next = Math.max(0, previous + (profile.id === winnerId ? rankingStake : -rankingStake));
      rankingChanges[profile.id] = next - previous;
      transaction.update(profile.ref, { "scores.PVP": next, totalScore: FieldValue.increment(next - previous) });
    }
    transaction.set(pvpPairRef(room.playerIds), {
      playerIds: room.playerIds, rankedUntil: Timestamp.fromMillis(Date.now() + rematchCooldown),
    });
  }
  const result = {
    status: "finished" as const, players: room.players, winnerId, endReason, rankingChanges,
    ...(unrankedReason ? { unrankedReason } : {}),
    question: null, deadline: null, answeredIds: [], nextRoundAt: null, roundResult: null,
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
