import { useEffect } from "react";
import { GameState } from "../api/types";
import { scoreService } from "../services/scoreService";

const useSaveGameScore = (
    gameState: GameState,
    gameId: string | null,
    userId: string | null,
    gameScore: number
) => {
    useEffect(() => {
        if (gameState === GameState.Finished && gameId && userId) {
            const saveScore = async () => {
                try {
                    await scoreService.saveGameScore(userId, gameId, gameScore);
                } catch (error) {
                    console.error("Error saving score:", error);
                }
            };
            saveScore();
        }
    }, [gameState, gameId, userId, gameScore]);
};

export default useSaveGameScore;
