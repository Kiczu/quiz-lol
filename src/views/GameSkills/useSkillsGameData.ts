import { useCallback, useContext, useEffect, useState } from "react";

import { GameContext } from "../../context/GameContext/GameContext";
import { SkillRound, gameRoundService } from "../../services/gameRoundService";

const useSkillsGameData = () => {
    const [round, setRound] = useState<SkillRound | null>(null);
    const [wrongGuesses, setWrongGuesses] = useState(0);
    const [usedChampions, setUsedChampions] = useState<string[]>([]);
    const [isRoundOver, setIsRoundOver] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const { handleEndGame } = useContext(GameContext);

    const startRound = useCallback(async () => {
        setIsLoading(true);
        setHasError(false);

        try {
            setRound(await gameRoundService.startRound<SkillRound>("Skills"));
            setWrongGuesses(0);
            setUsedChampions([]);
            setIsRoundOver(false);
        } catch (error) {
            console.error(error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        startRound();
    }, [startRound]);

    const handleSelectChampion = async (championId: string) => {
        if (!round || isRoundOver || usedChampions.includes(championId)) return;

        setUsedChampions((used) => [...used, championId]);

        try {
            const result = await gameRoundService.submitGuess(round.roundId, championId);
            setWrongGuesses(result.wrongGuesses);

            if (result.finished) {
                setIsRoundOver(true);
                handleEndGame(result.points, result.won);
            }
        } catch (error) {
            console.error(error);
            setHasError(true);
        }
    };

    return {
        round,
        wrongGuesses,
        maxAttempts: round?.maxAttempts ?? 0,
        usedChampions,
        isLoading,
        hasError,
        handleSelectChampion,
        startRound,
    };
};

export default useSkillsGameData;
