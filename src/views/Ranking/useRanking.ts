import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "../../api/firebase/db";

interface ScoreData {
    userId: string;
    username: string;
    score: number;
}

const useRanking = (selectedGameMode: string) => {
    const [ranking, setRanking] = useState<ScoreData[]>([]);

    useEffect(() => {
        const load = async () => {
            const result = await fetchRanking(selectedGameMode);
            setRanking(result);
        };
        load().catch(() => setRanking([]));
    }, [selectedGameMode]);

    return { ranking };
};

const fetchRanking = async (selectedGameMode: string): Promise<ScoreData[]> => {
    if (selectedGameMode === "TotalScore") {
        return await fetchGlobalLeaderboard();
    }

    const querySnapshot = await getDocs(collection(db, "scores"));
    const rankingData = processRankingData(querySnapshot.docs, selectedGameMode);

    const userIds = Array.from(new Set(rankingData.map(item => item.userId)));
    const usernames = await fetchUsernames(userIds);

    return rankingData.map(item => ({
        ...item,
        username: usernames[item.userId] || "Unknown"
    }));
};

const fetchGlobalLeaderboard = async (): Promise<ScoreData[]> => {
    const snapshot = await getDocs(collection(db, "scores"));
    const totalScores: ScoreData[] = [];

    for (const docSnap of snapshot.docs) {
        if (docSnap.id.includes("_")) continue;
        const data = docSnap.data();
        totalScores.push({
            userId: docSnap.id,
            score: data.totalScore || 0,
            username: data.username || "Unknown"
        });
    }

    return totalScores.sort((a, b) => b.score - a.score);
};

const processRankingData = (
    docs: QueryDocumentSnapshot[],
    selectedGameMode: string
): ScoreData[] => {
    const ranking: ScoreData[] = [];

    docs.forEach((doc) => {
        const data = doc.data();
        const userId = doc.id;

        if (!data.scores || typeof data.scores !== "object") return;

        const score = data.scores[selectedGameMode] ?? 0;

        if (score > 0) {
            ranking.push({
                userId,
                score,
                username: "",
            });
        }
    });

    return ranking.sort((a, b) => b.score - a.score);
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
