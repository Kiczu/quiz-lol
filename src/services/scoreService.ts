import { doc, setDoc, collection, query, getDocs, getDoc, updateDoc, where } from "firebase/firestore";

import { db } from "../api/firebase/db";
import { EditableUserFields, ScoresMap, UserPublicData } from "../api/types";
import { filterEmptyFields } from "../utils/object";

const createUserPublic = async ({
    uid,
    username,
    avatar = null,
}: {
    uid: string;
    username: string;
    avatar?: string | null;
}) => {
    await setDoc(doc(db, "scores", uid), {
        username,
        avatar,
        scores: {},
        totalScore: 0,
    });
};

const getUserPublic = async (uid: string): Promise<UserPublicData | null> => {
    const snap = await getDoc(doc(db, "scores", uid));
    return snap.exists() ? (snap.data() as UserPublicData) : null;
};

const updateUserPublic = async (uid: string, updates: EditableUserFields) => {
    const filtered = filterEmptyFields(updates);
    if (Object.keys(filtered).length > 0) {
        await updateDoc(doc(db, "scores", uid), filtered);
    }
};

const updateUserAvatar = async (uid: string, avatarPath: string) => {
    const userDoc = doc(db, "scores", uid);
    await updateDoc(userDoc, { avatar: avatarPath });
};
const isUsernameTaken = async (username: string): Promise<boolean> => {
    const q = query(collection(db, "scores"), where("username", "==", username));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
};
const getUserScores = async (userId: string): Promise<{ scores: ScoresMap; totalScore: number }> => {
    const ref = doc(db, "scores", userId);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
        return { scores: {}, totalScore: 0 };
    }
    return {
        scores: snap.data().scores || {},
        totalScore: snap.data().totalScore || 0,
    };
};

export type LeaderboardEntry = {
    userId: string;
    username: string;
    score: number;
    avatar?: string;
};

const getLeaderboard = async (gameId: string): Promise<LeaderboardEntry[]> => {
    const snapshot = await getDocs(collection(db, "scores"));
    const isTotal = gameId === "TotalScore";
    return snapshot.docs.flatMap((document) => {
        const data = document.data();
        const score = (isTotal ? data.totalScore : data.scores?.[gameId]) ?? 0;
        if (!data.username || (isTotal && document.id.includes("_"))
            || !Number.isFinite(score) || (!isTotal && score <= 0)) return [];
        return [{ userId: document.id, username: data.username, avatar: data.avatar || "", score }];
    }).sort((a, b) => b.score - a.score);
};

export const scoreService = {
    createUserPublic,
    getUserPublic,
    updateUserPublic,
    updateUserAvatar,
    isUsernameTaken,
    getUserScores,
    getLeaderboard,
};
