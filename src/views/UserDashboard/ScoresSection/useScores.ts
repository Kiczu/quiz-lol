import { useEffect, useState } from "react";
import { ScoresMap } from "../../../api/types";
import { scoreService } from "../../../services/scoreService";

export const useScores = (userId: string | undefined) => {
    const [scores, setScores] = useState<ScoresMap | null>(null);
    const [totalScore, setTotalScore] = useState<number>(0);

    useEffect(() => {
        if (userId) {
            const fetchScores = async () => {
                const { scores, totalScore } = await scoreService.getUserScores(userId);
                setScores(scores);
                setTotalScore(totalScore);
            };
            fetchScores();
        }

    }, [userId]);
    return { scores, totalScore };
}