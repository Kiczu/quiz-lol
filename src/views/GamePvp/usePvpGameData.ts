import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useAuth } from "../../context/LoginContext/LoginContext";
import { PvpRoom, pvpService } from "../../services/pvpService";

import useMatchmaking from "./useMatchmaking";
import usePvpPresence from "./usePvpPresence";

const usePvpGameData = () => {
    const { userData } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const code = searchParams.get("room") ?? "";
    const matchmaking = useMatchmaking(code ? undefined : userData?.uid, (matchedCode) => setSearchParams({ room: matchedCode }));
    const [room, setRoom] = useState<PvpRoom | null>(null);
    const connectionError = usePvpPresence(code, room?.mode === "ranked" && room.status === "playing");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);
    const [submittedRound, setSubmittedRound] = useState<number | null>(null);
    const [now, setNow] = useState(Date.now());
    const inFlight = useRef(false);

    useEffect(() => {
        setRoom(null);
        setError("");
        setSubmittedRound(null);
        if (!code) return;
        if (!/^[A-F0-9]{6}$/.test(code)) {
            setError("Invalid room code. Return to the lobby and enter a six-character code.");
            return;
        }
        return pvpService.watchRoom(code, setRoom, () => {
            setError("Could not connect to this room. Check your connection or join again from the lobby.");
        });
    }, [code]);

    useEffect(() => {
        const timer = window.setInterval(() => setNow(Date.now()), 1000);
        return () => window.clearInterval(timer);
    }, []);

    const run = async (action: () => Promise<void>) => {
        if (inFlight.current) return;
        inFlight.current = true;
        setBusy(true);
        setError("");
        try {
            await action();
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : "Something went wrong. Try again.");
        } finally {
            inFlight.current = false;
            setBusy(false);
        }
    };

    const create = () => run(async () => {
        const result = await pvpService.createRoom();
        setSearchParams({ room: result.data.code });
    });

    const join = (value: string) => run(async () => {
        const result = await pvpService.joinRoom({ code: value.trim().toUpperCase() });
        setSearchParams({ room: result.data.code });
    });

    const answer = (guess: string) => run(async () => {
        if (!userData || !room || room.status !== "playing" || room.answeredIds.includes(userData.uid)
            || submittedRound === room.currentRound) return;
        const round = room.currentRound;
        await pvpService.submitAnswer({ code, round, guess });
        setSubmittedRound(round);
    });

    const advance = () => run(async () => {
        if (!room) return;
        await pvpService.advanceRound({ code, round: room.currentRound });
    });

    const leave = () => run(async () => {
        if (room && (room.status === "waiting" || room.status === "playing")) {
            await pvpService.leaveRoom({ code });
        }
        setSearchParams({});
    });

    const expired = !!room && room.expiresAt <= now && room.status !== "finished";
    const secondsLeft = room?.deadline ? Math.max(0, Math.ceil((room.deadline - now) / 1000)) : 0;
    const answered = !!room && (room.answeredIds.includes(userData?.uid ?? "") || submittedRound === room.currentRound);

    return { code, room, error, connectionError, busy, uid: userData?.uid, expired, secondsLeft, answered, create, join, answer, advance, leave, matchmaking };
};

export default usePvpGameData;
