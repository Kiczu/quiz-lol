import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { pvpService } from "../../services/pvpService";

import usePvpActivity from "./usePvpActivity";

vi.mock("../../services/pvpService", () => ({ pvpService: { getActivity: vi.fn() } }));

describe("usePvpActivity", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        vi.mocked(pvpService.getActivity).mockResolvedValue({ data: { searching: 1, playing: 2 } });
    });
    afterEach(() => vi.useRealTimers());

    it("refreshes the player count every thirty seconds while enabled", async () => {
        vi.useFakeTimers();
        const view = renderHook(() => usePvpActivity(true));
        await act(() => vi.advanceTimersByTimeAsync(0));
        expect(view.result.current).toEqual({ searching: 1, playing: 2 });
        vi.mocked(pvpService.getActivity).mockResolvedValue({ data: { searching: 0, playing: 4 } });
        await act(() => vi.advanceTimersByTimeAsync(30_000));
        expect(pvpService.getActivity).toHaveBeenCalledTimes(2);
        expect(view.result.current).toEqual({ searching: 0, playing: 4 });
    });

    it("stays quiet when disabled and stops polling once disabled", async () => {
        vi.useFakeTimers();
        const view = renderHook(({ enabled }) => usePvpActivity(enabled), { initialProps: { enabled: false } });
        await act(() => vi.advanceTimersByTimeAsync(60_000));
        expect(pvpService.getActivity).not.toHaveBeenCalled();
        view.rerender({ enabled: true });
        await act(() => vi.advanceTimersByTimeAsync(0));
        view.rerender({ enabled: false });
        await act(() => vi.advanceTimersByTimeAsync(60_000));
        expect(pvpService.getActivity).toHaveBeenCalledOnce();
        expect(view.result.current).toBeNull();
    });

    it("hides the count when it cannot be loaded", async () => {
        vi.mocked(pvpService.getActivity).mockRejectedValue(new Error("offline"));
        const view = renderHook(() => usePvpActivity(true));
        await waitFor(() => expect(pvpService.getActivity).toHaveBeenCalled());
        expect(view.result.current).toBeNull();
    });
});
