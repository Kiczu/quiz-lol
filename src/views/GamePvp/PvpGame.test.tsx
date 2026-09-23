import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PvpRoom, PvpSearch, pvpService } from "../../services/pvpService";

import PvpGame from "./PvpGame";

vi.mock("../../services/pvpService", () => ({ pvpService: {
    createRoom: vi.fn(), joinRoom: vi.fn(), watchRoom: vi.fn(), submitAnswer: vi.fn(), advanceRound: vi.fn(), leaveRoom: vi.fn(),
    findMatch: vi.fn(), cancelSearch: vi.fn(), watchSearch: vi.fn(), heartbeat: vi.fn(),
} }));
vi.mock("../../context/LoginContext/LoginContext", () => ({ useAuth: () => ({ userData: { uid: "host" } }) }));
const setImage = vi.fn();
const showModal = vi.fn();
const closeModal = vi.fn();
vi.mock("../../context/ModalContext/ModalContext", () => ({ useModal: () => ({ showModal, closeModal }) }));
vi.mock("../../context/BackgroundContext/BackgroundContext", () => ({ useBackground: () => ({ setImage }) }));

let updateRoom: (room: PvpRoom) => void;
let updateSearch: (search: PvpSearch) => void;
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
        vi.mocked(pvpService.findMatch).mockResolvedValue({ data: { state: "waiting", code: null } });
        vi.mocked(pvpService.heartbeat).mockResolvedValue({ data: { acknowledged: true } });
        vi.mocked(pvpService.advanceRound).mockResolvedValue({ data: { advanced: true } });
        vi.mocked(pvpService.cancelSearch).mockResolvedValue({ data: { state: "cancelled", code: null } });
        vi.mocked(pvpService.watchSearch).mockImplementation((_uid, onSearch) => {
            updateSearch = onSearch;
            return vi.fn();
        });
    });

    afterEach(() => vi.useRealTimers());

    it("uses the full mode name without displaying the ranked rules in the lobby", () => {
        open("/game/pvp");
        expect(screen.getByRole("heading", { name: "Player vs Player" })).toBeInTheDocument();
        expect(screen.queryByText(/Ranked: win/)).not.toBeInTheDocument();
        expect(screen.getByText("Private matches never affect your ranking.")).toBeInTheDocument();
    });

    it("finds an online opponent and opens the match without a room code", async () => {
        open("/game/pvp");
        fireEvent.click(screen.getByRole("button", { name: "Find opponent" }));
        expect(await screen.findByText("Finding an opponent")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Cancel search" })).toBeEnabled();
        expect(screen.queryByLabelText("Room code")).not.toBeInTheDocument();
        const { searchId } = vi.mocked(pvpService.findMatch).mock.calls[0][0]!;
        act(() => updateSearch({ searchId, state: "matched", code: "ABC123", expiresAt: 0 }));
        await waitFor(() => expect(pvpService.watchRoom).toHaveBeenCalled());
        act(() => updateRoom(room));
        expect(screen.getByText("Test ability")).toBeInTheDocument();
        expect(pvpService.createRoom).not.toHaveBeenCalled();
        expect(pvpService.joinRoom).not.toHaveBeenCalled();
    });

    it("creates a room, shows its code and follows the opponent joining", async () => {
        vi.mocked(pvpService.createRoom).mockResolvedValue({ data: { code: "ABC123" } });
        open("/game/pvp");
        fireEvent.click(screen.getByRole("button", { name: "Create private room" }));
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

    it("automatically requests a server-controlled timeout transition", async () => {
        open();
        act(() => updateRoom({ ...room, deadline: Date.now() - 1000 }));
        expect(screen.getByRole("button", { name: /Ahri/ })).toBeDisabled();
        await waitFor(() => expect(pvpService.advanceRound).toHaveBeenCalledWith({ code: "ABC123", round: 0 }));
    });

    it("shows the actual ranking delta separately from the match score", () => {
        open();
        act(() => updateRoom({ ...room, mode: "ranked", status: "finished", winnerId: "guest", rankingChanges: { host: -8, guest: 20 } }));
        expect(screen.getByText("Player vs Player ranking: -8.")).toBeInTheDocument();
        expect(screen.getByText("Defeat")).toBeInTheDocument();
    });

    it("shows the round winner and answer, waits five seconds and unlocks the next question", async () => {
        vi.useFakeTimers();
        open();
        act(() => updateRoom(room));
        vi.mocked(pvpService.submitAnswer).mockResolvedValue({ data: { accepted: true } });
        await act(async () => fireEvent.click(screen.getByRole("button", { name: /Ahri/ })));
        act(() => updateRoom({ ...room, question: null, deadline: null, nextRoundAt: Date.now() + 5000,
            players: room.players.map((player) => ({ ...player, score: player.uid === "host" ? 10 : 0 })),
            roundResult: { winnerId: "host", answer: { id: "Ahri", name: "Ahri" }, correctIds: ["host"] },
        }));
        expect(screen.getByText("Host wins the round")).toBeInTheDocument();
        expect(screen.getByText("Correct answer: Ahri")).toBeInTheDocument();
        expect(screen.getByText("Correct answer +10")).toBeInTheDocument();
        expect(screen.getByText("No points this round")).toBeInTheDocument();
        expect(screen.getByText("Next round in 5s")).toBeInTheDocument();
        expect(screen.queryByText("Test ability")).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /Ahri/ })).not.toBeInTheDocument();
        await act(async () => vi.advanceTimersByTimeAsync(4999));
        expect(pvpService.advanceRound).not.toHaveBeenCalled();
        await act(async () => vi.advanceTimersByTimeAsync(1));
        expect(pvpService.advanceRound).toHaveBeenCalledExactlyOnceWith({ code: "ABC123", round: 0 });
        expect(screen.getByText("Starting the next round...")).toBeInTheDocument();
        act(() => updateRoom({ ...room, currentRound: 1, deadline: Date.now() + 60_000, nextRoundAt: null, roundResult: null }));
        expect(screen.queryByText("Host wins the round")).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Ahri/ })).toBeEnabled();
    });

    it("restores a shared countdown after refresh, retries a failed transition and stops on exit", async () => {
        vi.useFakeTimers();
        vi.mocked(pvpService.advanceRound).mockRejectedValueOnce(new Error("Connection interrupted"));
        const view = open();
        act(() => updateRoom({ ...room, question: null, deadline: null, nextRoundAt: Date.now() + 2000,
            roundResult: { winnerId: null, answer: { id: "Ahri", name: "Ahri" }, correctIds: [] },
        }));
        expect(screen.getByText("Round drawn")).toBeInTheDocument();
        expect(screen.getByText("Next round in 2s")).toBeInTheDocument();
        await act(async () => vi.advanceTimersByTimeAsync(2000));
        expect(screen.getByText("Connection interrupted")).toBeInTheDocument();
        expect(pvpService.advanceRound).toHaveBeenCalledTimes(1);
        await act(async () => vi.advanceTimersByTimeAsync(1000));
        expect(pvpService.advanceRound).toHaveBeenCalledTimes(2);
        expect(screen.queryByText("Connection interrupted")).not.toBeInTheDocument();
        view.unmount();
        await act(async () => vi.advanceTimersByTimeAsync(10_000));
        expect(pvpService.advanceRound).toHaveBeenCalledTimes(2);
    });

    it("renders mixed questions with text-only answers and submits their option ids", async () => {
        open();
        act(() => updateRoom({ ...room, question: {
            category: "Lore", prompt: "Whose story is described below?", image: null,
            text: "A traveller from a distant land...", dataVersion: "test",
            options: ["Ahri", "Ashe", "Akali", "Aatrox"].map((name) => ({ id: "answer-" + name, name })),
        } }));
        expect(screen.getByText("Lore")).toBeInTheDocument();
        expect(screen.getByText("A traveller from a distant land...")).toBeInTheDocument();
        expect(screen.queryByRole("img")).not.toBeInTheDocument();
        vi.mocked(pvpService.submitAnswer).mockResolvedValue({ data: { accepted: true } });
        fireEvent.click(screen.getByRole("button", { name: "Ahri" }));
        await waitFor(() => expect(pvpService.submitAnswer).toHaveBeenCalledWith({ code: "ABC123", round: 0, guess: "answer-Ahri" }));
    });

    it("requires confirmation before forfeiting a ranked match", async () => {
        open();
        act(() => updateRoom({ ...room, mode: "ranked" }));
        fireEvent.click(screen.getByRole("button", { name: "Leave room" }));
        expect(pvpService.leaveRoom).not.toHaveBeenCalled();
        expect(showModal).toHaveBeenCalledWith(expect.objectContaining({ title: "Forfeit this ranked match?" }));
        vi.mocked(pvpService.leaveRoom).mockResolvedValue({ data: { left: true } });
        await act(async () => showModal.mock.calls[0][0].onConfirm());
        expect(pvpService.leaveRoom).toHaveBeenCalledWith({ code: "ABC123" });
    });
});
