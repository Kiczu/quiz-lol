import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GameContext } from "../../context/GameContext/GameContext";
import { GuessResult, gameRoundService } from "../../services/gameRoundService";

import useRegionGameData from "./useRegionGameData";

vi.mock("../../services/gameRoundService", () => ({
  gameRoundService: {
    startRound: vi.fn(),
    submitGuess: vi.fn(),
  },
}));

const round = {
  roundId: "round-1",
  maxAttempts: 3,
  championName: "Aatrox",
  championIcon: "Aatrox.png",
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
const startNewGame = vi.fn();
const handleStartGame = vi.fn();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <GameContext.Provider
    value={{
      gameId: "Regions",
      gameScore: 0,
      gameState: "InProgress" as never,
      isWin: false,
      startNewGame,
      handleStartGame,
      handleEndGame,
    }}
  >
    {children}
  </GameContext.Provider>
);

const renderGame = async () => {
  const view = renderHook(() => useRegionGameData(), { wrapper });
  await waitFor(() => expect(view.result.current.isLoading).toBe(false));
  return view;
};

describe("useRegionGameData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(gameRoundService.startRound).mockResolvedValue(round);
  });

  it("never receives the region from the server", async () => {
    const { result } = await renderGame();

    expect(result.current.round).not.toHaveProperty("region");
    expect(JSON.stringify(result.current.round)).not.toContain("noxus");
  });

  it("leaves the game lifecycle to GameBox", async () => {
    await renderGame();

    expect(startNewGame).not.toHaveBeenCalled();
    expect(handleStartGame).not.toHaveBeenCalled();
  });

  it("ends the game with the points the server awarded", async () => {
    vi.mocked(gameRoundService.submitGuess).mockResolvedValue(
      guessResult({ correct: true, won: true, finished: true, wrongGuesses: 1, points: 6, answer: "noxus" })
    );
    const { result } = await renderGame();

    await act(async () => {
      await result.current.handleSelectRegion("noxus");
    });

    expect(handleEndGame).toHaveBeenCalledWith(6, true);
  });

  it("ends as a loss when the server says the round is over", async () => {
    vi.mocked(gameRoundService.submitGuess).mockResolvedValue(
      guessResult({ finished: true, wrongGuesses: 3, answer: "noxus" })
    );
    const { result } = await renderGame();

    await act(async () => {
      await result.current.handleSelectRegion("ionia");
    });

    expect(handleEndGame).toHaveBeenCalledWith(0, false);
  });

  it("does not ask twice about the same region", async () => {
    vi.mocked(gameRoundService.submitGuess).mockResolvedValue(guessResult());
    const { result } = await renderGame();

    await act(async () => {
      await result.current.handleSelectRegion("ionia");
    });
    await act(async () => {
      await result.current.handleSelectRegion("ionia");
    });

    expect(gameRoundService.submitGuess).toHaveBeenCalledTimes(1);
  });
});
