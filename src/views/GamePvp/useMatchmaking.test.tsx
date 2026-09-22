import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PvpSearch, pvpService } from "../../services/pvpService";

import useMatchmaking from "./useMatchmaking";

vi.mock("../../services/pvpService", () => ({ pvpService: {
    findMatch: vi.fn(), cancelSearch: vi.fn(), watchSearch: vi.fn(),
} }));

const onMatched = vi.fn();
const unsubscribe = vi.fn();
let receive: (ticket: PvpSearch) => void;

describe("useMatchmaking", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        vi.mocked(pvpService.findMatch).mockResolvedValue({ data: { state: "waiting", code: null } });
        vi.mocked(pvpService.cancelSearch).mockResolvedValue({ data: { state: "cancelled", code: null } });
        vi.mocked(pvpService.watchSearch).mockImplementation((_uid, callback) => {
            receive = callback;
            return unsubscribe;
        });
    });
    afterEach(() => vi.useRealTimers());

    it("only queues after opting in and follows a match found by another player", async () => {
        const view = renderHook(() => useMatchmaking("host", onMatched));
        expect(pvpService.findMatch).not.toHaveBeenCalled();
        act(() => view.result.current.start());
        await waitFor(() => expect(pvpService.findMatch).toHaveBeenCalledOnce());
        const { searchId } = vi.mocked(pvpService.findMatch).mock.calls[0][0]!;
        act(() => receive({ searchId, state: "matched", code: "ABC123", expiresAt: 0 }));
        expect(onMatched).toHaveBeenCalledWith("ABC123");
        expect(view.result.current.searching).toBe(false);
        expect(unsubscribe).toHaveBeenCalledOnce();
    });

    it("renews the same search every ten seconds and retries network failures", async () => {
        vi.useFakeTimers();
        vi.mocked(pvpService.findMatch).mockRejectedValueOnce(new Error("offline"));
        const view = renderHook(() => useMatchmaking("host", onMatched));
        await act(async () => view.result.current.start());
        expect(view.result.current.error).toContain("Reconnecting");
        await act(async () => vi.advanceTimersByTimeAsync(10_000));
        expect(pvpService.findMatch).toHaveBeenCalledTimes(2);
        expect(vi.mocked(pvpService.findMatch).mock.calls[0]).toEqual(vi.mocked(pvpService.findMatch).mock.calls[1]);
        expect(view.result.current.error).toBe("");
        view.unmount();
    });

    it("cancels the server ticket and ignores late notifications", async () => {
        const view = renderHook(() => useMatchmaking("host", onMatched));
        await act(async () => view.result.current.start());
        const callback = receive;
        const { searchId } = vi.mocked(pvpService.findMatch).mock.calls[0][0]!;
        await act(async () => view.result.current.cancel());
        act(() => callback({ searchId, state: "matched", code: "ABC123", expiresAt: 0 }));
        expect(onMatched).not.toHaveBeenCalled();
        expect(view.result.current.searching).toBe(false);
        expect(pvpService.cancelSearch).toHaveBeenCalledWith({ searchId });
    });

    it("enters an already committed match when cancellation loses the race", async () => {
        const view = renderHook(() => useMatchmaking("host", onMatched));
        await act(async () => view.result.current.start());
        vi.mocked(pvpService.cancelSearch).mockResolvedValue({ data: { state: "matched", code: "ABC123" } });
        await act(async () => view.result.current.cancel());
        expect(onMatched).toHaveBeenCalledWith("ABC123");
        expect(view.result.current.searching).toBe(false);
    });

    it("cleans up the subscription and queue request on navigation", async () => {
        const view = renderHook(() => useMatchmaking("host", onMatched));
        await act(async () => view.result.current.start());
        view.unmount();
        expect(unsubscribe).toHaveBeenCalledOnce();
        expect(pvpService.cancelSearch).toHaveBeenCalledOnce();
    });

    it("does not navigate after unmounting during cancellation", async () => {
        const view = renderHook(() => useMatchmaking("host", onMatched));
        await act(async () => view.result.current.start());
        let finish: (value: { data: { state: "matched"; code: string } }) => void;
        vi.mocked(pvpService.cancelSearch).mockImplementationOnce(() => new Promise((resolve) => { finish = resolve; }));
        let cancellation: Promise<void>;
        act(() => { cancellation = view.result.current.cancel(); });
        view.unmount();
        await act(async () => {
            finish({ data: { state: "matched", code: "ABC123" } });
            await cancellation;
        });
        expect(onMatched).not.toHaveBeenCalled();
    });
});
