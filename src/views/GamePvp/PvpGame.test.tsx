import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PvpRoom, pvpService } from "../../services/pvpService";

import PvpGame from "./PvpGame";

vi.mock("../../services/pvpService", () => ({ pvpService: {
    createRoom: vi.fn(), joinRoom: vi.fn(), watchRoom: vi.fn(), submitAnswer: vi.fn(), advanceRound: vi.fn(), leaveRoom: vi.fn(),
} }));
vi.mock("../../context/LoginContext/LoginContext", () => ({ useAuth: () => ({ userData: { uid: "host" } }) }));
const setImage = vi.fn();
vi.mock("../../context/BackgroundContext/BackgroundContext", () => ({ useBackground: () => ({ setImage }) }));

let updateRoom: (room: PvpRoom) => void;
const unsubscribe = vi.fn();
const room: PvpRoom = {
    status: "playing", playerIds: ["host", "guest"],
    players: [{ uid: "host", name: "Host", score: 0 }, { uid: "guest", name: "Guest", score: 0 }],
    currentRound: 0, totalRounds: 5, answeredIds: [], deadline: Date.now() + 60_000, expiresAt: Date.now() + 3_600_000, winnerId: null,
    question: { spellName: "Test ability", spellIcon: "spell.png", options: ["Ahri", "Ashe", "Akali", "Aatrox"].map((id) => ({ id, name: id, icon: `${id}.png` })) },
};

const open = (path = "/game/pvp?room=ABC123") => render(<MemoryRouter initialEntries={[path]}><PvpGame /></MemoryRouter>);

describe("PvpGame", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        vi.mocked(pvpService.watchRoom).mockImplementation((_code, onRoom) => {
            updateRoom = onRoom;
            return unsubscribe;
        });
    });

    it("creates a room, shows its code and follows the opponent joining", async () => {
        vi.mocked(pvpService.createRoom).mockResolvedValue({ data: { code: "ABC123" } });
        open("/game/pvp");
        fireEvent.click(screen.getByRole("button", { name: "Create room" }));
        await waitFor(() => expect(pvpService.watchRoom).toHaveBeenCalled());
        act(() => updateRoom({ ...room, status: "waiting", question: null, players: [room.players[0]] }));
        expect(screen.getByText("ABC123")).toBeInTheDocument();
        act(() => updateRoom(room));
        expect(screen.getByText("Test ability")).toBeInTheDocument();
        expect(screen.getByText("Guest")).toBeInTheDocument();
    });

    it("restores a submitted answer after refreshing and unsubscribes on exit", () => {
        const view = open();
        act(() => updateRoom({ ...room, answeredIds: ["host"] }));
        expect(screen.getByRole("button", { name: /Ahri/ })).toBeDisabled();
        expect(screen.getByText("Answer locked. Waiting for your opponent.")).toBeInTheDocument();
        view.unmount();
        expect(unsubscribe).toHaveBeenCalledTimes(1);
    });

    it("allows retry after a failed submission and locks the accepted answer", async () => {
        open();
        act(() => updateRoom(room));
        vi.mocked(pvpService.submitAnswer).mockRejectedValueOnce(new Error("Connection interrupted"));
        fireEvent.click(screen.getByRole("button", { name: /Ahri/ }));
        expect(await screen.findByText("Connection interrupted")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Ahri/ })).toBeEnabled();
        vi.mocked(pvpService.submitAnswer).mockResolvedValue({ data: { accepted: true } });
        fireEvent.click(screen.getByRole("button", { name: /Ahri/ }));
        await waitFor(() => expect(screen.getByRole("button", { name: /Ahri/ })).toBeDisabled());
        expect(pvpService.submitAnswer).toHaveBeenLastCalledWith({ code: "ABC123", round: 0, guess: "Ahri" });
    });

    it("shows a draw and final scores instead of a defeat", () => {
        open();
        act(() => updateRoom({ ...room, status: "finished", question: null, players: room.players.map((player) => ({ ...player, score: 30 })) }));
        expect(screen.getByText("Draw")).toBeInTheDocument();
        expect(screen.getByText(/Your score: 30/)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Back to lobby" })).toBeInTheDocument();
    });

    it("offers a server-controlled timeout transition", async () => {
        open();
        act(() => updateRoom({ ...room, deadline: Date.now() - 1000 }));
        expect(screen.getByRole("button", { name: /Ahri/ })).toBeDisabled();
        vi.mocked(pvpService.advanceRound).mockResolvedValue({ data: { advanced: true } });
        fireEvent.click(screen.getByRole("button", { name: /Time is up/ }));
        await waitFor(() => expect(pvpService.advanceRound).toHaveBeenCalledWith({ code: "ABC123", round: 0 }));
    });
});
