import { Box, Grid, Typography } from "@mui/material";
import { boxContainer, titleGame } from "./hangmanStyles";
import useHangmanData from "./useHangmanData";
import Keyboard from "./Keyboard/Keyboard";
import GameBox from "../../components/GameBox/GameBox";
import Lives from "./Lives/Lives";

const Hangman = () => {
  const { letters, wrongGuesses, maxAttempts, userGuess } = useHangmanData();

  return (
    <GameBox title="Hangman">
      <Box sx={boxContainer}>
        <Typography component="h1" variant="h3" sx={titleGame}>
          Hangman
        </Typography>

        <Grid container spacing={4}>
          <Grid
            item
            xs={12}
            md={6}
            display="flex"
            direction="column"
            justifyContent="center"
          >
            <Grid container direction="column" alignItems="center" spacing={2}>
              <Typography component="span" variant="h6" color="#fff">
                Number of failed attempts: {wrongGuesses}
              </Typography>
              <Box marginY={2} fontSize="1.5rem">
                {letters.map(({ value, isCorrect }, key) => (
                  <Typography
                    component="span"
                    key={key}
                    color="#fff"
                    minWidth={20}
                    sx={{ margin: "0 5px" }}
                  >
                    {isCorrect ? value : "__"}
                  </Typography>
                ))}
              </Box>
              <Box maxWidth={500}>
                <Keyboard userGuess={userGuess} />
              </Box>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Lives maxAttempts={maxAttempts} wrongGuesses={wrongGuesses} />
          </Grid>
        </Grid>
      </Box>
    </GameBox>
  );
};

export default Hangman;
