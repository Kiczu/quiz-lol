import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GameContext } from "../../context/GameContext/GameContext";
import { characterService } from "../../services/characterService";

import useSkillsGameData from "./useSkillsGameData";

vi.mock("../../services/characterService", () => ({
  characterService: {
    getAll: vi.fn(),
    getVersion: vi.fn(),
    getChampion: vi.fn(),
    getImageUrl: vi.fn(),
    getSpellImageUrl: vi.fn(),
  },
}));

const champions = ["Aatrox", "Ahri", "Akali", "Ashe", "Bard", "Darius"].map(
  (name) => ({ id: name, name })
);

const handleEndGame = vi.fn();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <GameContext.Provider
    value={{
      gameId: "Skills",
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
  const view = renderHook(() => useSkillsGameData(), { wrapper });
  await waitFor(() => expect(view.result.current.isLoading).toBe(false));
  return view;
};

describe("useSkillsGameData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(characterService.getAll).mockResolvedValue(champions as never);
    vi.mocked(characterService.getVersion).mockResolvedValue("16.17.1");
    vi.mocked(characterService.getChampion).mockResolvedValue({
      spells: [{ name: "Darkin Blade", image: { full: "AatroxQ.png" } }],
    } as never);
    vi.mocked(characterService.getImageUrl).mockReturnValue("icon.webp");
    vi.mocked(characterService.getSpellImageUrl).mockReturnValue("spell.webp");
  });

  it("offers four distinct champions including the answer", async () => {
    const { result } = await renderGame();
    const { options, answerId } = result.current.round!;

    expect(options).toHaveLength(4);
    expect(new Set(options.map((o) => o.id)).size).toBe(4);
    expect(options.some((o) => o.id === answerId)).toBe(true);
  });

  it("costs a life for a wrong champion and does not end the game", async () => {
    const { result } = await renderGame();
    const wrong = result.current.round!.options.find(
      (o) => o.id !== result.current.round!.answerId
    )!;

    act(() => result.current.handleSelectChampion(wrong.id));

    expect(result.current.wrongGuesses).toBe(1);
    expect(handleEndGame).not.toHaveBeenCalled();
  });

  it("scores fewer points once a life is lost", async () => {
    const { result } = await renderGame();
    const { options, answerId } = result.current.round!;
    const wrong = options.find((o) => o.id !== answerId)!;

    act(() => result.current.handleSelectChampion(wrong.id));
    act(() => result.current.handleSelectChampion(answerId));

    expect(handleEndGame).toHaveBeenCalledWith(6, true);
  });

  it("awards full points for a first time answer", async () => {
    const { result } = await renderGame();

    act(() => result.current.handleSelectChampion(result.current.round!.answerId));

    expect(handleEndGame).toHaveBeenCalledWith(10, true);
  });

  it("ends the game as a loss after three wrong champions", async () => {
    const { result } = await renderGame();
    const { options, answerId } = result.current.round!;
    const wrongOnes = options.filter((o) => o.id !== answerId);

    for (const option of wrongOnes) {
      act(() => result.current.handleSelectChampion(option.id));
    }

    expect(result.current.wrongGuesses).toBe(3);
    expect(handleEndGame).toHaveBeenCalledWith(0, false);
  });

  it("ignores a champion that was already picked", async () => {
    const { result } = await renderGame();
    const wrong = result.current.round!.options.find(
      (o) => o.id !== result.current.round!.answerId
    )!;

    act(() => result.current.handleSelectChampion(wrong.id));
    act(() => result.current.handleSelectChampion(wrong.id));

    expect(result.current.wrongGuesses).toBe(1);
  });

  it("reports a failure when the api cannot be reached", async () => {
    vi.mocked(characterService.getAll).mockRejectedValue(new Error("offline"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const { result } = await renderGame();

    expect(result.current.hasError).toBe(true);
    expect(result.current.round).toBeNull();
  });
});
