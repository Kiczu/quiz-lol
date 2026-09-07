import { useCallback, useContext, useEffect, useState } from "react";

import { GameContext } from "../../context/GameContext/GameContext";
import { HangmanRound, gameRoundService } from "../../services/gameRoundService";

const useHangmanData = () => {
    const [round, setRound] = useState<HangmanRound | null>(null);
    const [mask, setMask] = useState<string[]>([]);
    const [wrongGuesses, setWrongGuesses] = useState(0);
    const [usedLetters, setUsedLetters] = useState<string[]>([]);
    const [isRoundOver, setIsRoundOver] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const { handleEndGame } = useContext(GameContext);

    const startRound = useCallback(async () => {
        setIsLoading(true);
        setHasError(false);

        try {
            const next = await gameRoundService.startRound<HangmanRound>("Hangman");
            setRound(next);
            setMask(next.mask);
            setWrongGuesses(0);
            setUsedLetters([]);
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

    const userGuess = async (letter: string) => {
        if (!round || isRoundOver || usedLetters.includes(letter)) return;

        setUsedLetters((used) => [...used, letter]);

        try {
            const result = await gameRoundService.submitGuess(round.roundId, letter);
            setWrongGuesses(result.wrongGuesses);

            if (result.mask) {
                setMask(result.mask);
            }

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
        mask,
        wrongGuesses,
        maxAttempts: round?.maxAttempts ?? 0,
        usedLetters,
        isLoading,
        hasError,
        userGuess,
        startRound,
    };
};

export default useHangmanData;
