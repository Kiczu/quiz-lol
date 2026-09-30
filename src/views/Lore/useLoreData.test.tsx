import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ChampionDetails } from "../../api/types";
import { characterService } from "../../services/characterService";

import { useLoreData } from "./useLoreData";

vi.mock("../../services/characterService", () => ({
  characterService: {
    getAll: vi.fn(),
  },
}));

const champions = [
  { id: "Ahri", name: "Ahri" },
  { id: "Ashe", name: "Ashe" },
] as ChampionDetails[];

describe("useLoreData", () => {
  beforeEach(() => {
    vi.mocked(characterService.getAll).mockReset();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  it("stays loading until the champions arrive", async () => {
    vi.mocked(characterService.getAll).mockResolvedValue(champions);

    const { result } = renderHook(() => useLoreData());

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.champions).toEqual(champions);
    expect(result.current.hasError).toBe(false);
  });

  it("reports a failed load and recovers on retry", async () => {
    vi.mocked(characterService.getAll)
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce(champions);

    const { result } = renderHook(() => useLoreData());

    await waitFor(() => expect(result.current.hasError).toBe(true));
    expect(result.current.isLoading).toBe(false);

    await act(() => result.current.retry());

    expect(result.current.hasError).toBe(false);
    expect(result.current.champions).toEqual(champions);
  });

  it("filters champions by the search text", async () => {
    vi.mocked(characterService.getAll).mockResolvedValue(champions);

    const { result } = renderHook(() => useLoreData());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.handleSearchChange("as"));

    expect(result.current.champions.map((champion) => champion.id)).toEqual(["Ashe"]);
  });
});
