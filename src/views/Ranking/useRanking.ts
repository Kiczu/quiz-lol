import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../api/firebase/firebse";

interface ScoreData {
    userId: string;
    username: string;
    score: number;
}

const useRanking = (selectedGameMode: string) => {
    const [ranking, setRanking] = useState<ScoreData[]>([]);

    useEffect(() => {
        fetchRanking(selectedGameMode).then(setRanking).catch(() => setRanking([]));
    }, [selectedGameMode]);

    return { ranking };
};

const fetchRanking = async (selectedGameMode: string): Promise<ScoreData[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, "scores"));
        const rankingData = processRankingData(querySnapshot.docs, selectedGameMode);
        const userIds = Array.from(new Set(rankingData.map(item => item.userId)));
        const usernames = await fetchUsernames(userIds);

        return rankingData.map(item => ({
            ...item,
            username: usernames[item.userId] || "Unknown"
        }));
    } catch (error) {
        console.error("Error fetching ranking:", error);
        return [];
    }
};

const processRankingData = (docs: any[], selectedGameMode: string): ScoreData[] => {
    const rankingData: Record<string, number> = {};

    docs.forEach((doc) => {
        const [userId, gameMode] = doc.id.split("_");
        const score = doc.data().score || 0;

        if (selectedGameMode === "TotalScore") {
            rankingData[userId] = (rankingData[userId] || 0) + score;
        } else if (gameMode === selectedGameMode) {
            rankingData[userId] = score;
        }
    });

    return Object.entries(rankingData)
        .map(([userId, score]) => ({ userId, score, username: "" }))
        .sort((a, b) => b.score - a.score);
};

const fetchUsernames = async (userIds: string[]): Promise<Record<string, string>> => {
    const usernames: Record<string, string> = {};

    await Promise.all(userIds.map(async (userId) => {
        const userDoc = await getDoc(doc(db, "scores", userId));
        if (userDoc.exists()) {
            usernames[userId] = userDoc.data().username || "Unknown";
        }
    }));

    return usernames;
};

export default useRanking;
