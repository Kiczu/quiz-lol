import { doc, setDoc, collection, query, orderBy, getDocs, getDoc } from "firebase/firestore";
import { db } from "../api/firebase/db";
import { ScoresMap } from "../api/types";

const saveGameScore = async (userId: string, gameId: string, points: number) => {
    const scoreRef = doc(db, "scores", `${userId}_${gameId}`);
    const scoreSnap = await getDoc(scoreRef);

    const scores: ScoresMap = scoreSnap.exists() ? scoreSnap.data() : {
        userId,
        gameId,
        score: 0,
    };

    const current = scores[gameId] || 0;
    scores[gameId] = current + points;

    const totalScore = Object.values(scores).reduce((acc, score) => acc + score, 0);

    await setDoc(scoreRef, {
        scores,
        totalScore,
    }, { merge: true });
};

const getUserScores = async (userId: string): Promise<ScoresMap> => {
    const ref = doc(db, "scores", userId);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
        return {};
    }
    return snap.data().scores || {};
};

const getLeaderboard = async () => {
    const userRef = collection(db, "scores");
    const leaderboardQuery = query(userRef, orderBy("totalScore", "desc"));
    const querySnapshot = await getDocs(leaderboardQuery);

    return querySnapshot.docs.map(doc => ({
        userId: doc.id,
        ...doc.data(),
    }));
};

export const scoreService = {
    saveGameScore,
    getUserScores,
    getLeaderboard,
};