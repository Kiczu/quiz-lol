import { Box, Typography } from "@mui/material";
import { useContext } from "react";
import { Link } from "react-router-dom";


import Deafet from "../../assets/images/deafet.png";
import Victory from "../../assets/images/victory.png";
import { GameContext } from "../../context/GameContext/GameContext";
import { paths } from "../../paths";

import { endGameContainer, victoryGame, deafetGame } from "./gameBoxStyles";

const EndGame = () => {
  const { isWin, gameScore } = useContext(GameContext);
  return (
    <Box sx={endGameContainer}>
      {!isWin ? (
        <Box component="img" src={Deafet} sx={deafetGame}></Box>
      ) : (
        <>
          <Box component="img" src={Victory} sx={victoryGame}></Box>
          <Typography component="p">
            We give you extra points for winning!
          </Typography>
        </>
      )}
      <Typography component="p" fontSize="1.6rem">
        Your score is: {gameScore}
      </Typography>
      <Typography component="p" fontSize="1.2rem">
        You can check your total ranking <Link to={paths.RANKING}>here</Link>
      </Typography>
    </Box>
  );
};

export default EndGame;
