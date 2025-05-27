import { doc, setDoc, collection, query, orderBy, getDocs, getDoc } from "firebase/firestore";
import { db } from "../api/firebase/db";
import { ScoresMap } from "../api/types";

const saveGameScore = async (userId: string, gameId: string, score: number) => {
    const scoreRef = doc(db, "scores", userId);
    const scoreSnap = await getDoc(scoreRef);

    const scores: ScoresMap = scoreSnap.exists()
        ? scoreSnap.data().scores || {}
        : {};

    const current = scores[gameId] || 0;
    scores[gameId] = current + score;

    const totalScore = Object.values(scores).reduce((acc, val) => acc + val, 0);

    await setDoc(scoreRef, {
        scores,
        totalScore,
    }, { merge: true });
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