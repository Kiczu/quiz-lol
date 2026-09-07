import { useCallback, useContext, useEffect, useState } from "react";

import { GameContext } from "../../context/GameContext/GameContext";
import { RegionRound, gameRoundService } from "../../services/gameRoundService";

import { regions } from "./regionsData";

const useRegionGameData = () => {
    const [round, setRound] = useState<RegionRound | null>(null);
    const [wrongGuesses, setWrongGuesses] = useState(0);
    const [usedRegions, setUsedRegions] = useState<string[]>([]);
    const [isRoundOver, setIsRoundOver] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const { handleEndGame } = useContext(GameContext);

    const startRound = useCallback(async () => {
        setIsLoading(true);
        setHasError(false);

        try {
            setRound(await gameRoundService.startRound<RegionRound>("Regions"));
            setWrongGuesses(0);
            setUsedRegions([]);
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

    const handleSelectRegion = async (selected: string) => {
        if (!round || isRoundOver || usedRegions.includes(selected)) return;

        setUsedRegions((used) => [...used, selected]);

        try {
            const result = await gameRoundService.submitGuess(round.roundId, selected);
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
        regions,
        round,
        wrongGuesses,
        maxAttempts: round?.maxAttempts ?? 0,
        usedRegions,
        isLoading,
        hasError,
        handleSelectRegion,
        startRound,
    };
};

export default useRegionGameData;
