import { createContext, useState } from "react";
import { GameState } from "../../api/types";
import useSaveGameScore from "../../hooks/useSaveGameScore";
import { useAuth } from "../LoginContext/LoginContext";

interface Props {
  children: React.ReactNode;
}

interface GameContextType {
  gameId: string | null;
  gameScore: number;
  gameState: GameState;
  isWin: boolean;
  startNewGame: (gameId: string) => void;
  handleEndGame: (points: number, isWin: boolean) => void;
  handleStartGame: () => void;
}

export const GameContext = createContext<GameContextType>({
  gameId: "",
  gameScore: 0,
  gameState: GameState.NotStarted,
  isWin: false,
  startNewGame: () => {},
  handleStartGame: () => {},
  handleEndGame: () => {},
});

export const GameProvider = ({ children }: Props) => {
  const [gameState, setGameState] = useState<GameState>(GameState.NotStarted);
  const [gameScore, setGameScore] = useState<number>(0);
  const [gameId, setGameId] = useState<string | null>(null);
  const [isWin, setIsWin] = useState<boolean>(false);

  const { userData } = useAuth();
  const userId = userData?.uid ?? null;

  useSaveGameScore(gameState, gameId, userId, gameScore);

  const startNewGame = (gameId: string) => {
    setGameId(gameId);
    setGameState(GameState.NotStarted);
    setGameScore(0);
    setIsWin(false);
  };

  const handleStartGame = () => {
    setGameState(GameState.InProgress);
  };

  const handleEndGame = (points: number, isWin: boolean) => {
    setGameState(GameState.Finished);
    setGameScore(points);
    setIsWin(isWin);
  };

  return (
    <GameContext.Provider
      value={{
        gameId,
        gameScore,
        gameState,
        isWin,
        startNewGame,
        handleStartGame,
        handleEndGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
