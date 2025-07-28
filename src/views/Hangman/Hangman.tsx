import { Box, Container, Grid, Typography } from "@mui/material";

import GameBox from "../../components/GameBox/GameBox";
import Lives from "../../components/Lives/Lives";

import Answer from "./Answer/Answer";
import {
  hangmanViewWrapper,
  hangmanViewOverlay,
  titleGame,
  sectionTitle,
  keyboardWrapperBox,
  leftGrid,
  rightGrid,
} from "./hangman.style";
import Keyboard from "./Keyboard/Keyboard";
import useHangmanData from "./useHangmanData";

const Hangman = () => {
  const { letters, wrongGuesses, maxAttempts, usedLetters, userGuess } =
    useHangmanData();

  return (
    <GameBox title="Hangman">
      <Box sx={hangmanViewWrapper}>
        <Box sx={hangmanViewOverlay}>
          <Container maxWidth="xl">
            <Typography variant="h1" component="h1" sx={titleGame}>
              Hangman
            </Typography>
            <Answer letters={letters} />
            <Grid container>
              <Grid item xs={12} md={6} sx={leftGrid}>
                <Typography variant="h3" sx={sectionTitle}>
                  guess the champion
                </Typography>
                <Box sx={keyboardWrapperBox}>
                  <Keyboard
                    usedLetters={usedLetters}
                    onLetterClick={userGuess}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6} sx={rightGrid}>
                <Typography variant="h3" sx={sectionTitle}>
                  Lives
                </Typography>
                <Lives maxAttempts={maxAttempts} wrongGuesses={wrongGuesses} />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </GameBox>
  );
};

export default Hangman;
