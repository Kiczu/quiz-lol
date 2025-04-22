import { createContext, useEffect, useState } from "react";
import { auth } from "../../api/firebase/auth";
import { GameState } from "../../api/types";
import { scoreService } from "../../services/scoreService";

interface Props {
  children: React.ReactNode;
}

interface GameContextType {
  gameId: string | null;
  gameScore: number;
  gameState: GameState;
  isWin: boolean;
  setGameId: (gameId: string) => void;
  handleEndGame: (points: number, isWin: boolean) => void;
  handleStartGame: () => void;
}

export const GameContext = createContext<GameContextType>({
  gameId: "",
  gameScore: 0,
  gameState: GameState.NotStarted,
  isWin: false,
  setGameId: () => {},
  handleStartGame: () => {},
  handleEndGame: () => {},
});

export const GameProvider = ({ children }: Props) => {
  const [gameState, setGameState] = useState<GameState>(GameState.NotStarted);
  const [gameScore, setgameScore] = useState<number>(0);
  const [gameId, setGameId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isWin, setIsWin] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (gameState === GameState.Finished && gameId && userId) {
      const saveScore = async () => {
        try {
          await scoreService.saveGameScore(userId, gameId, gameScore);
        } catch (error) {
          console.error("Error saving score:", error);
        }
      };
      saveScore();
    }
  });

  const handleStartGame = () => {
    setGameState(GameState.InProgress);
  };

  const handleEndGame = (points: number, isWin: boolean) => {
    setGameState(GameState.Finished);
    setgameScore(points);
    setIsWin(isWin);
  };

  return (
    <GameContext.Provider
      value={{
        gameId,
        gameScore,
        gameState,
        isWin,
        setGameId,
        handleStartGame,
        handleEndGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
