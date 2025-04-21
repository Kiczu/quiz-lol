import { doc, setDoc, increment, collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../api/firebase/db"; 
import { Scores } from "../api/types";

const saveGameScore = async (userId: string, gameId: string, points: number) => {
    const scoreDoc = doc(db, "scores", `${userId}_${gameId}`);
    await setDoc(scoreDoc, {
        userId,
        gameId,
        score: increment(points),
        timestamp: new Date().toISOString(),
    }, { merge: true });

    const leaderboardDoc = doc(db, "leaderboards", userId);
    await setDoc(leaderboardDoc, {
        totalScore: increment(points),
    }, { merge: true });
};

const getUserScores = async (userId: string): Promise<Scores[]> => {
    const scoresRef = collection(db, "scores");
    const userScoresQuery = query(scoresRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(userScoresQuery);

    return querySnapshot.docs.map(doc => ({
        gameId: doc.data().gameId,
        score: doc.data().score,
    }));
};

const getLeaderboard = async () => {
    const leaderboardRef = collection(db, "leaderboards");
    const leaderboardQuery = query(leaderboardRef, orderBy("totalScore", "desc"));
    const querySnapshot = await getDocs(leaderboardQuery);

    return querySnapshot.docs.map(doc => ({
        userId: doc.id,
        ...doc.data(),
    }));
};

const groupScoresByGame = (scores: Scores[]): Scores[] => {
    const grouped: Record<string, number> = {};

    scores.forEach(({ gameId, score }) => {
        if (!grouped[gameId]) {
            grouped[gameId] = 0;
        }
        grouped[gameId] += score;
    });

    return Object.entries(grouped).map(([gameId, score]) => ({
        gameId,
        score,
    }));
};

export const scoreService = {
    saveGameScore,
    getUserScores,
    getLeaderboard,
    groupScoresByGame,
};