import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GameContext } from "../../context/GameContext/GameContext";
import { GuessResult, gameRoundService } from "../../services/gameRoundService";

import useHangmanData from "./useHangmanData";

vi.mock("../../services/gameRoundService", () => ({
  gameRoundService: {
    startRound: vi.fn(),
    submitGuess: vi.fn(),
  },
}));

const round = {
  roundId: "round-1",
  maxAttempts: 6,
  mask: ["", "", "", "", "", ""],
};

const guessResult = (overrides: Partial<GuessResult> = {}): GuessResult => ({
  correct: false,
  won: false,
  finished: false,
  wrongGuesses: 1,
  points: 0,
  mask: null,
  answer: null,
  ...overrides,
});

const handleEndGame = vi.fn();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <GameContext.Provider
    value={{
      gameId: "Hangman",
      gameScore: 0,
      gameState: "InProgress" as never,
      isWin: false,
      startNewGame: vi.fn(),
      handleStartGame: vi.fn(),
      handleEndGame,
    }}
  >
    {children}
  </GameContext.Provider>
);

const renderGame = async () => {
  const view = renderHook(() => useHangmanData(), { wrapper });
  await waitFor(() => expect(view.result.current.isLoading).toBe(false));
  return view;
};

describe("useHangmanData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(gameRoundService.startRound).mockResolvedValue(round);
  });

  it("starts with a mask that hides every letter", async () => {
    const { result } = await renderGame();

    expect(result.current.mask).toEqual(["", "", "", "", "", ""]);
    expect(JSON.stringify(result.current)).not.toContain("AATROX");
  });

  it("reveals only what the server sends back", async () => {
    vi.mocked(gameRoundService.submitGuess).mockResolvedValue(
      guessResult({ correct: true, wrongGuesses: 0, points: 1, mask: ["A", "A", "", "", "", ""] })
    );
    const { result } = await renderGame();

    await act(async () => {
      await result.current.userGuess("A");
    });

    expect(result.current.mask).toEqual(["A", "A", "", "", "", ""]);
    expect(result.current.usedLetters).toEqual(["A"]);
  });

  it("ends the game with the points the server awarded, bonus included", async () => {
    vi.mocked(gameRoundService.submitGuess).mockResolvedValue(
      guessResult({
        correct: true,
        won: true,
        finished: true,
        wrongGuesses: 1,
        points: 15,
        mask: ["A", "A", "T", "R", "O", "X"],
        answer: "AATROX",
      })
    );
    const { result } = await renderGame();

    await act(async () => {
      await result.current.userGuess("X");
    });

    expect(handleEndGame).toHaveBeenCalledWith(15, true);
  });

  it("ends as a loss when the server runs the lives out", async () => {
    vi.mocked(gameRoundService.submitGuess).mockResolvedValue(
      guessResult({ finished: true, wrongGuesses: 6, points: 2, answer: "AATROX" })
    );
    const { result } = await renderGame();

    await act(async () => {
      await result.current.userGuess("Z");
    });

    expect(handleEndGame).toHaveBeenCalledWith(2, false);
  });

  it("does not spend a call on a letter already guessed", async () => {
    vi.mocked(gameRoundService.submitGuess).mockResolvedValue(guessResult());
    const { result } = await renderGame();

    await act(async () => {
      await result.current.userGuess("Z");
    });
    await act(async () => {
      await result.current.userGuess("Z");
    });

    expect(gameRoundService.submitGuess).toHaveBeenCalledTimes(1);
  });
});
