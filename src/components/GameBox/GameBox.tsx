import { Box } from "@mui/material";
import { useContext, useEffect } from "react";

import { GameState } from "../../api/types";
import { GameContext } from "../../context/GameContext/GameContext";
import { fillColumn } from "../../theme/layout";

import EndGame from "./EndGame";
import StartGame from "./StartGame";

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
    <Box sx={fillColumn}>
      <Box sx={fillColumn}>
        {gameState === GameState.NotStarted && <StartGame />}

        {gameState === GameState.InProgress && (
          <Box width={"100%"} sx={fillColumn}>
            {children}
          </Box>
        )}
        {gameState === GameState.Finished && <EndGame />}
      </Box>
    </Box>
  );
};

export default GameBox;
