import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

import { pvpService } from "../../services/pvpService";

import usePvpPresence from "./usePvpPresence";

vi.mock("../../services/pvpService", () => ({ pvpService: { heartbeat: vi.fn() } }));

beforeEach(() => {
    vi.resetAllMocks();
    vi.useFakeTimers();
    vi.mocked(pvpService.heartbeat).mockResolvedValue({ data: { acknowledged: true } });
});
afterEach(() => vi.useRealTimers());

it("renews ranked presence, retries failures and stops on navigation", async () => {
    vi.mocked(pvpService.heartbeat).mockRejectedValueOnce(new Error("offline"));
    const view = renderHook(() => usePvpPresence("ABC123", true));
    await act(async () => {});
    expect(view.result.current).toContain("Reconnect within 60 seconds");
    await act(async () => vi.advanceTimersByTimeAsync(15_000));
    expect(view.result.current).toBe("");
    expect(pvpService.heartbeat).toHaveBeenCalledTimes(2);
    view.unmount();
    await act(async () => vi.advanceTimersByTimeAsync(60_000));
    expect(pvpService.heartbeat).toHaveBeenCalledTimes(2);
});

it("does not send heartbeats for private or finished rooms", async () => {
    const view = renderHook(() => usePvpPresence("ABC123", false));
    await act(async () => vi.advanceTimersByTimeAsync(30_000));
    expect(pvpService.heartbeat).not.toHaveBeenCalled();
    view.unmount();
});
