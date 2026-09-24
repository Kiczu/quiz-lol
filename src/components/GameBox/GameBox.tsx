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
  state?: GameState;
  startScreen?: React.ReactNode;
  endScreen?: React.ReactNode;
};

const GameBox = ({ children, title, state, startScreen, endScreen }: Props) => {
  const { gameState: localState, gameId, startNewGame } = useContext(GameContext);
  const gameState = state ?? localState;

  useEffect(() => {
    if (state === undefined && title && gameId !== title) {
      startNewGame(title);
    }
  }, [title, gameId, startNewGame, state]);

  return (
    <Box sx={{ ...fillColumn, width: "100%" }}>
      <Box sx={fillColumn}>
        {gameState === GameState.NotStarted && (startScreen !== undefined ? startScreen : <StartGame />)}

        {gameState === GameState.InProgress && (
          <Box width={"100%"} sx={fillColumn}>
            {children}
          </Box>
        )}
        {gameState === GameState.Finished && (endScreen !== undefined ? endScreen : <EndGame />)}
      </Box>
    </Box>
  );
};

export default GameBox;
