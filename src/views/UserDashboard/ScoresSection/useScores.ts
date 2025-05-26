import { useEffect, useState } from "react";
import { ScoresMap } from "../../../api/types";
import { scoreService } from "../../../services/scoreService";

export const useScores = (userId: string | undefined) => {
    const [scores, setScores] = useState<ScoresMap[] | null>(null);

    useEffect(() => {
        if (userId) {
            const fetchScores = async () => {
                const scoresArray = await scoreService.getUserScores(userId);
                // const groupedScores = scoreService.groupScoresByGame(scoresArray);
                // setScores(groupedScores);
            };
            fetchScores();
        }

    }, [userId]);
    return { scores };
}