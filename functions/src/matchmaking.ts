import { randomBytes } from "node:crypto";

import { HttpsError, onCall } from "firebase-functions/v2/https";

import { Room, loadPvpRounds, makePvpRoom, playerName } from "./pvp";
import { db, requireString, requireUid } from "./shared";

const options = { region: "europe-west1", maxInstances: 10 };
const leaseDuration = 45_000;
const queue = db.collection("pvpQueue");

type SearchResult = { state: "waiting" | "matched" | "cancelled"; code: string | null };
type Ticket = SearchResult & { searchId: string; expiresAt: number };
const waiting: SearchResult = { state: "waiting", code: null };
const cancelled: SearchResult = { state: "cancelled", code: null };

const searchIdFor = (value: unknown) => requireString(value, "searchId", /^[\w-]{16,64}$/);

export const searchForOpponent = async (
  uid: string,
  searchId: string,
  loadRounds = loadPvpRounds
): Promise<SearchResult> => {
  const ref = queue.doc(uid);
  const initial = await db.runTransaction(async (transaction): Promise<SearchResult> => {
    const own = (await transaction.get(ref)).data() as Ticket | undefined;
    const profile = await transaction.get(db.collection("scores").doc(uid));
    if (!profile.exists) throw new HttpsError("failed-precondition", "Create your profile before playing.");
    if (own?.state === "matched" && own.code) {
      const room = (await transaction.get(db.collection("pvpRooms").doc(own.code))).data() as Room | undefined;
      if (room?.status === "playing" && room.expiresAt > Date.now()) {
        return { state: "matched", code: own.code };
      }
      if (own.searchId === searchId) return cancelled;
    }
    if (own?.state === "cancelled" && own.searchId === searchId) return cancelled;
    if (own?.state === "waiting" && own.expiresAt > Date.now() && own.searchId !== searchId) {
      throw new HttpsError("already-exists", "You are already searching in another window.");
    }
    transaction.set(ref, { ...waiting, searchId, expiresAt: Date.now() + leaseDuration });
    return waiting;
  });
  if (initial.state !== "waiting") return initial;

  const candidates = await queue.where("expiresAt", ">", Date.now()).orderBy("expiresAt").limit(25).get();
  const opponent = candidates.docs.find((doc) => doc.id !== uid && doc.data().state === "waiting");
  if (!opponent) return waiting;

  const rounds = await loadRounds();
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const roomRef = db.collection("pvpRooms").doc(randomBytes(3).toString("hex").toUpperCase());
    const matched = await db.runTransaction(async (transaction): Promise<SearchResult | null> => {
      const own = (await transaction.get(ref)).data() as Ticket | undefined;
      const other = (await transaction.get(opponent.ref)).data() as Ticket | undefined;
      if (own?.state === "matched") return { state: "matched", code: own.code };
      if (!own || own.searchId !== searchId || own.state !== "waiting") return cancelled;
      if (own.expiresAt <= Date.now() || !other || other.state !== "waiting" || other.expiresAt <= Date.now()) return waiting;
      const profiles = await transaction.getAll(db.collection("scores").doc(uid), db.collection("scores").doc(opponent.id));
      const collision = await transaction.get(roomRef);
      if (collision.exists) return null;
      if (!profiles.every((profile) => profile.exists)) {
        profiles.forEach((profile) => {
          if (!profile.exists) transaction.set(queue.doc(profile.id), {
            ...cancelled, expiresAt: 0, searchId: profile.id === uid ? searchId : other.searchId,
          });
        });
        return profiles[0].exists ? waiting : cancelled;
      }

      const result: SearchResult = { state: "matched", code: roomRef.id };
      transaction.create(roomRef, makePvpRoom(profiles.map((profile) => ({
        uid: profile.id, name: playerName(profile.data()?.username), score: 0,
      })), rounds[0].question));
      transaction.create(roomRef.collection("secret").doc("game"), { rounds, answers: {} });
      transaction.set(ref, { ...result, searchId, expiresAt: 0 });
      transaction.set(opponent.ref, { ...result, searchId: other.searchId, expiresAt: 0 });
      return result;
    });
    if (matched) return matched;
  }
  throw new HttpsError("resource-exhausted", "Could not create a match. Please try again.");
};

export const cancelSearch = (uid: string, searchId: string) => db.runTransaction(async (transaction): Promise<SearchResult> => {
  const ref = queue.doc(uid);
  const ticket = (await transaction.get(ref)).data() as Ticket | undefined;
  if (ticket && ticket.searchId !== searchId) return cancelled;
  if (ticket?.state === "matched") return { state: "matched", code: ticket.code };
  transaction.set(ref, { ...cancelled, searchId, expiresAt: 0 });
  return cancelled;
});

export const findPvpMatch = onCall(options, (request) =>
  searchForOpponent(requireUid(request.auth?.uid), searchIdFor(request.data?.searchId)));

export const cancelPvpSearch = onCall(options, (request) =>
  cancelSearch(requireUid(request.auth?.uid), searchIdFor(request.data?.searchId)));
