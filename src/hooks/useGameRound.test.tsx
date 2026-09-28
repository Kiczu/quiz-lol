import { act, renderHook, waitFor } from "@testing-library/react";
import { StrictMode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GameState } from "../api/types";
import { GameContext } from "../context/GameContext/GameContext";
import { GuessResult, SkillRound, gameRoundService } from "../services/gameRoundService";

import useGameRound from "./useGameRound";

vi.mock("../services/gameRoundService", () => ({ gameRoundService: { startRound: vi.fn(), submitGuess: vi.fn() } }));

const round = { roundId: "one", maxAttempts: 3, spellName: "Test", spellIcon: "test.png", options: [] };
const handleEndGame = vi.fn();
let gameState = GameState.InProgress;
const wrapper = ({ children }: { children: React.ReactNode }) => (
    <StrictMode>
        <GameContext.Provider value={{
            gameId: "Skills", gameState, gameScore: 0, isWin: false,
            handleStartGame: vi.fn(), startNewGame: vi.fn(), handleEndGame,
        }}>{children}</GameContext.Provider>
    </StrictMode>
);

describe("useGameRound", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        gameState = GameState.InProgress;
        vi.mocked(gameRoundService.startRound).mockResolvedValue(round);
    });

    it("waits for Play and creates only one round in StrictMode", async () => {
        gameState = GameState.NotStarted;
        const view = renderHook(() => useGameRound<SkillRound>("Skills"), { wrapper });
        expect(gameRoundService.startRound).not.toHaveBeenCalled();
        gameState = GameState.InProgress;
        view.rerender();
        await waitFor(() => expect(view.result.current.round).toEqual(round));
        expect(gameRoundService.startRound).toHaveBeenCalledTimes(1);
    });

    it("deduplicates initial requests during the StrictMode effect replay", async () => {
        const view = renderHook(() => useGameRound<SkillRound>("Skills"), { wrapper });
        await waitFor(() => expect(view.result.current.isLoading).toBe(false));
        expect(gameRoundService.startRound).toHaveBeenCalledTimes(1);
    });

    it("retries a failed answer without consuming it or ending the game twice", async () => {
        const view = renderHook(() => useGameRound<SkillRound>("Skills"), { wrapper });
        await waitFor(() => expect(view.result.current.round).toBeTruthy());
        vi.mocked(gameRoundService.submitGuess).mockRejectedValueOnce(new Error("network"));
        await act(async () => { await view.result.current.submitGuess("Ahri"); });
        expect(view.result.current.used).toEqual([]);
        expect(view.result.current.hasError).toBe(true);
        vi.mocked(gameRoundService.submitGuess).mockResolvedValue({
            correct: true, won: true, finished: true, wrongGuesses: 0, points: 10, mask: null, answer: "Ahri",
        });
        await act(async () => {
            await Promise.all([view.result.current.submitGuess("Ahri"), view.result.current.submitGuess("Ashe")]);
        });
        expect(handleEndGame).toHaveBeenCalledTimes(1);
        expect(handleEndGame).toHaveBeenCalledWith(10, true);
        expect(view.result.current.hasError).toBe(false);
        expect(gameRoundService.submitGuess).toHaveBeenCalledTimes(2);
    });

    it("locks input until the pending answer finishes", async () => {
        let resolve!: (value: GuessResult) => void;
        vi.mocked(gameRoundService.submitGuess).mockImplementation(() => new Promise((done) => { resolve = done; }));
        const view = renderHook(() => useGameRound<SkillRound>("Skills"), { wrapper });
        await waitFor(() => expect(view.result.current.round).toBeTruthy());
        act(() => { void view.result.current.submitGuess("Ashe"); });
        await act(async () => { await view.result.current.submitGuess("Ahri"); });
        expect(gameRoundService.submitGuess).toHaveBeenCalledTimes(1);
        expect(view.result.current.isSubmitting).toBe(true);
        await act(async () => { resolve({ correct: false, won: false, finished: false, points: 0, wrongGuesses: 1, mask: null, answer: null }); });
        expect(view.result.current.isSubmitting).toBe(false);
    });

    it("starts a fresh round after Play again", async () => {
        const view = renderHook(() => useGameRound<SkillRound>("Skills"), { wrapper });
        await waitFor(() => expect(view.result.current.round).toBeTruthy());
        gameState = GameState.NotStarted;
        view.rerender();
        vi.mocked(gameRoundService.startRound).mockResolvedValue({ ...round, roundId: "two" });
        gameState = GameState.InProgress;
        view.rerender();
        await waitFor(() => expect(view.result.current.round?.roundId).toBe("two"));
        expect(gameRoundService.startRound).toHaveBeenCalledTimes(2);
    });
});
