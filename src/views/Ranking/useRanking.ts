import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../api/firebase/firebse";

interface ScoreData {
    userId: string;
    score: number;
}

const useRanking = (selectedGameMode: string) => {
    const [ranking, setRanking] = useState<ScoreData[]>([]);

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const scoresRef = collection(db, "scores");
                const rankingQuery = query(scoresRef);
                const querySnapshot = await getDocs(rankingQuery);

                const rankingData: ScoreData[] = querySnapshot.docs
                    .map((doc) => {
                        const [userId, gameMode] = doc.id.split("_");
                        const data = doc.data();

                        return {
                            userId,
                            score: data.score || 0,
                            gameMode,
                        };
                    })
                    .filter((item) => item.gameMode === selectedGameMode)
                    .sort((a, b) => b.score - a.score);
                setRanking(rankingData);
            } catch (error) {
                console.error("Error fetching ranking:", error);
                setRanking([]);
            }
        };

        fetchRanking();
    }, [selectedGameMode]);

    return { ranking };
};

export default useRanking;
