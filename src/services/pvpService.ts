import { doc, onSnapshot } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";

import { db } from "../api/firebase/db";
import { functions } from "../api/firebase/functions";

import { ChampionOption } from "./gameRoundService";

export type PvpQuestion = {
    category: string;
    prompt: string;
    image: string | null;
    text: string | null;
    dataVersion: string;
    options: { id: string; name: string; icon?: string }[];
} | { spellName: string; spellIcon: string; options: ChampionOption[] };

export type PvpRoom = {
    mode?: "private" | "ranked";
    rankingChanges?: Record<string, number>;
    endReason?: "score" | "forfeit" | "disconnect" | "abandoned";
    status: "waiting" | "playing" | "finished" | "cancelled";
    playerIds: string[];
    players: { uid: string; name: string; score: number }[];
    currentRound: number;
    totalRounds: number;
    question: PvpQuestion | null;
    answeredIds: string[];
    deadline: number | null;
    expiresAt: number;
    winnerId: string | null;
};

const createRoom = httpsCallable<void, { code: string }>(functions, "createPvpRoom");
const joinRoom = httpsCallable<{ code: string }, { code: string }>(functions, "joinPvpRoom");
const submitAnswer = httpsCallable<{ code: string; round: number; guess: string }>(functions, "submitPvpAnswer");
const advanceRound = httpsCallable<{ code: string; round: number }>(functions, "advancePvpRound");
const leaveRoom = httpsCallable<{ code: string }>(functions, "leavePvpRoom");
const heartbeat = httpsCallable<{ code: string }>(functions, "heartbeatPvpRoom");

export type PvpSearchResult = { state: "waiting" | "matched" | "cancelled"; code: string | null };
export type PvpSearch = PvpSearchResult & { searchId: string; expiresAt: number };

const findMatch = httpsCallable<{ searchId: string }, PvpSearchResult>(functions, "findPvpMatch");
const cancelSearch = httpsCallable<{ searchId: string }, PvpSearchResult>(functions, "cancelPvpSearch");
const watchSearch = (uid: string, onSearch: (search: PvpSearch) => void, onError: (error: Error) => void) =>
    onSnapshot(doc(db, "pvpQueue", uid), (snapshot) => {
        if (snapshot.exists()) onSearch(snapshot.data() as PvpSearch);
    }, onError);

const watchRoom = (code: string, onRoom: (room: PvpRoom) => void, onError: (error: Error) => void) =>
    onSnapshot(doc(db, "pvpRooms", code), (snapshot) => {
        if (!snapshot.exists()) {
            onError(new Error("This room no longer exists."));
            return;
        }
        onRoom(snapshot.data() as PvpRoom);
    }, onError);

export const pvpService = { createRoom, joinRoom, submitAnswer, advanceRound, leaveRoom, heartbeat, watchRoom, findMatch, cancelSearch, watchSearch };
