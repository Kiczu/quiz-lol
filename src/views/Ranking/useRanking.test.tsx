import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";

import { LeaderboardEntry, scoreService } from "../../services/scoreService";

import useRanking from "./useRanking";

vi.mock("../../services/scoreService", () => ({ scoreService: { getLeaderboard: vi.fn() } }));
beforeEach(() => vi.resetAllMocks());

it("ignores a slower result from the previous ranking tab", async () => {
    let complete: (entries: LeaderboardEntry[]) => void = () => {};
    vi.mocked(scoreService.getLeaderboard)
        .mockImplementationOnce(() => new Promise((resolve) => { complete = resolve; }))
        .mockResolvedValueOnce([{ userId: "pvp", username: "Player", score: 20 }]);
    const view = renderHook(({ mode }) => useRanking(mode), { initialProps: { mode: "Skills" } });
    view.rerender({ mode: "PVP" });
    await waitFor(() => expect(view.result.current.ranking[0]?.userId).toBe("pvp"));
    await act(async () => complete([{ userId: "old", username: "Old", score: 10 }]));
    expect(view.result.current.ranking[0]?.userId).toBe("pvp");
});

it("clears the previous ranking when the next request fails", async () => {
    vi.mocked(scoreService.getLeaderboard)
        .mockResolvedValueOnce([{ userId: "one", username: "One", score: 10 }])
        .mockRejectedValueOnce(new Error("offline"));
    const view = renderHook(({ mode }) => useRanking(mode), { initialProps: { mode: "Skills" } });
    await waitFor(() => expect(view.result.current.ranking).toHaveLength(1));
    view.rerender({ mode: "PVP" });
    await act(async () => {});
    expect(view.result.current.ranking).toEqual([]);
});
