import { useContext, useEffect } from "react";
import { Box } from "@mui/material";
import { GameState } from "../../api/types";
import { GameContext } from "../../context/GameContext/GameContext";
import StartGame from "./StartGame";
import EndGame from "./EndGame";

type Props = {
  title: string;
  children?: React.ReactNode;
};

const GameBox = ({ children, title }: Props) => {
  const { gameState, gameId, startNewGame } = useContext(GameContext);

  useEffect(() => {
    if (title && gameId !== title) {
      startNewGame(title);
    }
  }, [title, gameId, startNewGame]);

  return (
    <Box>
      <Box>
        {gameState === GameState.NotStarted && <StartGame />}

        {gameState === GameState.InProgress && (
          <Box width={"100%"}>{children}</Box>
        )}
        {gameState === GameState.Finished && <EndGame />}
      </Box>
    </Box>
  );
};

export default GameBox;
