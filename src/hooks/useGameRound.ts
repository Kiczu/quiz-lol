import { useContext, useEffect, useRef, useState } from "react";

import { GameState } from "../api/types";
import { GameContext } from "../context/GameContext/GameContext";
import { GuessResult, RoundBase, gameRoundService } from "../services/gameRoundService";

const useGameRound = <T extends RoundBase>(gameId: string) => {
    const { gameState, handleEndGame } = useContext(GameContext);
    const [round, setRound] = useState<T | null>(null);
    const [result, setResult] = useState<GuessResult | null>(null);
    const [used, setUsed] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [attempt, setAttempt] = useState(0);
    const startRequest = useRef<Promise<T> | null>(null);
    const submitting = useRef(false);
    const finished = useRef(false);

    useEffect(() => {
        if (gameState === GameState.NotStarted) {
            startRequest.current = null;
            setRound(null);
        }
        if (gameState !== GameState.InProgress) return;
        let active = true;
        setIsLoading(true);
        setHasError(false);
        startRequest.current ??= gameRoundService.startRound<T>(gameId);
        startRequest.current.then((next) => {
            if (!active) return;
            setRound(next);
            setResult(null);
            setUsed([]);
            finished.current = false;
        }).catch(() => {
            if (active) setHasError(true);
        }).finally(() => {
            if (active) setIsLoading(false);
        });
        return () => { active = false; };
    }, [gameState, gameId, attempt]);

    const startRound = () => {
        startRequest.current = null;
        setAttempt((value) => value + 1);
    };

    const submitGuess = async (guess: string) => {
        if (!round || submitting.current || finished.current || used.includes(guess)) return;
        submitting.current = true;
        setIsSubmitting(true);
        setHasError(false);
        try {
            const next = await gameRoundService.submitGuess(round.roundId, guess);
            setResult(next);
            setUsed((previous) => [...previous, guess]);
            if (next.finished) {
                finished.current = true;
                handleEndGame(next.points, next.won);
            }
        } catch {
            setHasError(true);
        } finally {
            submitting.current = false;
            setIsSubmitting(false);
        }
    };

    return {
        round, result, used, isLoading, isSubmitting, hasError, startRound, submitGuess,
        wrongGuesses: result?.wrongGuesses ?? 0,
        maxAttempts: round?.maxAttempts ?? 0,
    };
};

export default useGameRound;
