import { Alert, Box, Button, CircularProgress, Container, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { GameState } from "../../api/types";
import backgroundMap from "../../assets/images/backgroundMap.webp";
import GameBox from "../../components/GameBox/GameBox";
import { useBackground } from "../../context/BackgroundContext/BackgroundContext";
import { useModal } from "../../context/ModalContext/ModalContext";
import { WavingButton } from "../../muiComponentsStyles";
import { paths } from "../../paths";
import { colors } from "../../theme/colors";
import { useResponsiveColumns } from "../../utils/useResponsiveColumns";
import { skillsTitle } from "../GameSkills/skillsGame.style";

import { lobbyPanel, playerPanel, pvpContent, pvpWrapper, roomCode } from "./pvpGame.style";
import PvpQuestionPanel from "./PvpQuestionPanel";
import usePvpGameData from "./usePvpGameData";

const PvpGame = () => {
    const game = usePvpGameData();
    const [joinCode, setJoinCode] = useState("");
    const { setImage } = useBackground();
    const { showModal, closeModal } = useModal();
    const columns = useResponsiveColumns({ xs: 1, sm: 2, md: 4 });
    const { room } = game;
    const leaveRoom = () => {
        if (room?.mode !== "ranked" || room.status !== "playing") return void game.leave();
        showModal({
            variant: "confirm", title: "Forfeit this ranked match?",
            content: "Leaving gives your opponent the win and costs up to 20 ranking points.",
            onlyConfirm: false, onCancel: closeModal,
            onConfirm: () => { closeModal(); void game.leave(); },
        });
    };
    const rankingChange = room?.rankingChanges?.[game.uid ?? ""] ?? 0;

    useEffect(() => {
        setImage(backgroundMap);
        return () => setImage(undefined);
    }, [setImage]);

    const lobby = !game.code && game.matchmaking.searching ? (
        <Box sx={lobbyPanel}>
            <Typography variant="h3">Finding an opponent</Typography>
            <CircularProgress size={32} sx={{ alignSelf: "center", color: colors.gold2 }} />
            <Typography role="status">Waiting for another player to join the queue…</Typography>
            <Typography color={colors.textSecondary}>Keep this page open. Your match will start automatically when an opponent is found.</Typography>
            <Button variant="outlined" disabled={game.matchmaking.cancelling} onClick={game.matchmaking.cancel}>
                {game.matchmaking.cancelling ? "Cancelling…" : "Cancel search"}
            </Button>
        </Box>
    ) : !game.code ? (
        <Box sx={lobbyPanel}>
            <Typography variant="h3">Play against an online opponent</Typography>
            <Typography color={colors.textSecondary}>
                Five shared questions from different League categories. One answer each, 10 points for a correct guess.
                You have 60 seconds per question. Highest score wins; equal scores are a draw.
            </Typography>
            <WavingButton disabled={game.busy} onClick={game.matchmaking.start}>Find opponent</WavingButton>
            <Typography color={colors.textSecondary}>Prefer to play with a friend?</Typography>
            <Button variant="outlined" disabled={game.busy} onClick={game.create}>Create private room</Button>
            <Typography variant="body2">Private matches never affect your ranking.</Typography>
            <Typography>or join with a room code</Typography>
            <Box component="form" onSubmit={(event) => { event.preventDefault(); void game.join(joinCode); }}>
                <Stack spacing={2}>
                    <TextField
                        label="Room code"
                        value={joinCode}
                        onChange={(event) => setJoinCode(event.target.value.toUpperCase().replace(/[^A-F0-9]/g, ""))}
                        inputProps={{ maxLength: 6, autoCapitalize: "characters" }}
                        autoComplete="off"
                    />
                    <Button type="submit" variant="outlined" disabled={game.busy || joinCode.length !== 6}>Join room</Button>
                </Stack>
            </Box>
        </Box>
    ) : room ? (
        <Box sx={lobbyPanel}>
            <Typography variant="h3">Waiting for your opponent</Typography>
            <Typography>Share this code with a friend:</Typography>
            <Typography sx={roomCode}>{game.code}</Typography>
            <Typography color={colors.textSecondary}>
                The match starts when they join. You can refresh this page and return to the same room.
            </Typography>
            <CircularProgress size={24} sx={{ alignSelf: "center", color: colors.gold2 }} />
        </Box>
    ) : !game.error ? <CircularProgress /> : null;

    const ended = room?.status === "finished" || room?.status === "cancelled" || game.expired;
    const result = (
        <Box sx={lobbyPanel}>
            <Typography variant="h2" sx={skillsTitle}>
                {game.expired ? "Room expired" : room?.endReason === "abandoned" ? "Match abandoned" : room?.status === "cancelled" ? "Match cancelled"
                    : !room?.winnerId ? "Draw" : room.winnerId === game.uid ? "Victory" : "Defeat"}
            </Typography>
            <Typography>
                {room?.status === "finished"
                    ? `Your score: ${room.players.find((player) => player.uid === game.uid)?.score ?? 0}.`
                    : "No ranking points were awarded. Create a new room to play again."}
            </Typography>
            {room?.status === "finished" && <Typography>
                {room.mode === "ranked" ? `Player vs Player ranking: ${rankingChange > 0 ? "+" : ""}${rankingChange}.`
                    : "Private match. Ranking unchanged."}
            </Typography>}
            {(room?.endReason === "forfeit" || room?.endReason === "disconnect") && <Typography>
                {room.endReason === "forfeit" ? "The match ended by forfeit." : "The match ended after a player failed to reconnect within 60 seconds."}
            </Typography>}
            <Button component={Link} to={paths.RANKING}>View ranking</Button>
            <WavingButton disabled={game.busy} onClick={game.leave}>Back to lobby</WavingButton>
        </Box>
    );

    return (
        <Box sx={pvpWrapper}>
            <Container maxWidth="lg" sx={pvpContent}>
                <Typography variant="h1" sx={{ ...skillsTitle, fontSize: { xs: "2rem", sm: "2.5rem" } }}>Player vs Player</Typography>
                <Typography color={colors.textSecondary}>League quiz · 1 vs 1</Typography>
                {game.error && <Alert severity="error" role="alert">{game.error}</Alert>}
                {game.connectionError && <Alert severity="warning">{game.connectionError}</Alert>}
                {game.matchmaking.error && <Alert severity="warning">{game.matchmaking.error}</Alert>}
                {game.busy && <CircularProgress size={24} aria-label="Saving" />}
                {room && (
                    <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
                        {room.players.map((player) => (
                            <Box key={player.uid} sx={playerPanel}>
                                <Typography color={player.uid === game.uid ? colors.gold2 : colors.blue1}>
                                    {player.name}{player.uid === game.uid ? " (you)" : ""}
                                </Typography>
                                <Typography variant="h3">{player.score}</Typography>
                                {room.status === "playing" && <Typography variant="body2">
                                    {room.roundResult ? room.roundResult.correctIds.includes(player.uid) ? "Correct answer +10" : "No points this round"
                                        : room.answeredIds.includes(player.uid) ? "Answer locked" : "Choosing an answer"}
                                </Typography>}
                            </Box>
                        ))}
                    </Stack>
                )}
                <GameBox
                    title="PVP"
                    state={ended ? GameState.Finished : room?.status === "playing" ? GameState.InProgress : GameState.NotStarted}
                    startScreen={lobby}
                    endScreen={result}
                >
                    {room?.roundResult && <Box sx={lobbyPanel}>
                        <Typography>Round {room.currentRound + 1} / {room.totalRounds} complete</Typography>
                        <Typography variant="h2" sx={{ ...skillsTitle, overflowWrap: "anywhere" }}>
                            {room.roundResult.winnerId
                                ? `${room.players.find((player) => player.uid === room.roundResult?.winnerId)?.name ?? "Player"} wins the round`
                                : "Round drawn"}
                        </Typography>
                        <Typography>Correct answer: {room.roundResult.answer.name}</Typography>
                        <Typography role="status" aria-live="polite">
                            {game.breakSecondsLeft > 0 ? `Next round in ${game.breakSecondsLeft}s` : "Starting the next round..."}
                        </Typography>
                    </Box>}
                    {room?.question && <Stack spacing={3} alignItems="center">
                        <Typography>Round {room.currentRound + 1} / {room.totalRounds} · {game.secondsLeft}s</Typography>
                        <PvpQuestionPanel
                            question={room.question}
                            columns={columns}
                            disabled={game.busy || game.answered || game.secondsLeft === 0}
                            onSelect={game.answer}
                        />
                        <Typography role="status" aria-live="polite">
                            {game.answered ? "Answer locked. Waiting for your opponent." : "Choose carefully — one answer per round."}
                        </Typography>
                        {game.secondsLeft === 0 && <Button variant="outlined" disabled={game.busy} onClick={game.advance}>
                            Time is up — continue
                        </Button>}
                    </Stack>}
                </GameBox>
                {game.code && !ended && <>
                    <Button disabled={game.busy} onClick={leaveRoom}>{room ? "Leave room" : "Back to lobby"}</Button>
                    {room?.status === "playing" && <Typography variant="caption" color={colors.textSecondary}>
                        {room.mode === "ranked"
                            ? "Leaving forfeits the match. After a disconnect you have 60 seconds to return. Keep this page open while playing."
                            : "Leaving cancels this private match. No ranking points are awarded."}
                    </Typography>}
                </>}
            </Container>
        </Box>
    );
};

export default PvpGame;
