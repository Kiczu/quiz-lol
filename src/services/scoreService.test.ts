import { getDoc, getDocs } from "firebase/firestore";
import { beforeEach, expect, it, vi } from "vitest";

import { scoreService } from "./scoreService";

vi.mock("../api/firebase/db", () => ({ db: {} }));
vi.mock("firebase/firestore", () => ({
    doc: vi.fn(), setDoc: vi.fn(), collection: vi.fn(), query: vi.fn(),
    getDocs: vi.fn(), getDoc: vi.fn(), updateDoc: vi.fn(), where: vi.fn(),
}));

beforeEach(() => {
    vi.resetAllMocks();
    const entries = [
        { id: "one", data: { username: "One", avatar: "one.png", totalScore: 30, scores: { PVP: 20 } } },
        { id: "two", data: { username: "Two", totalScore: 10, scores: { PVP: 10 } } },
        { id: "zero", data: { username: "Zero", totalScore: 0, scores: {} } },
        { id: "missing", data: { totalScore: 100, scores: { PVP: 100 } } },
        { id: "legacy_row", data: { totalScore: 200 } },
    ];
    vi.mocked(getDocs).mockResolvedValue({ docs: entries.map(({ id, data }) => ({ id, data: () => data })) } as never);
});

it("reads scores and public details once without fetching each player again", async () => {
    expect(await scoreService.getLeaderboard("PVP")).toEqual([
        { userId: "one", username: "One", avatar: "one.png", score: 20 },
        { userId: "two", username: "Two", avatar: "", score: 10 },
    ]);
    expect(getDocs).toHaveBeenCalledOnce();
    expect(getDoc).not.toHaveBeenCalled();
});

it("keeps zero-score profiles in the total ranking and omits legacy rows", async () => {
    expect((await scoreService.getLeaderboard("TotalScore")).map(({ userId, score }) => [userId, score]))
        .toEqual([["one", 30], ["two", 10], ["zero", 0]]);
    expect(getDocs).toHaveBeenCalledOnce();
    expect(getDoc).not.toHaveBeenCalled();
});
