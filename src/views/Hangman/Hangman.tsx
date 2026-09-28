import { Box, Container, Grid, Typography } from "@mui/material";

import GameBox from "../../components/GameBox/GameBox";
import RoundContent from "../../components/GameBox/RoundContent";
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
  const {
    round,
    mask,
    wrongGuesses,
    maxAttempts,
    usedLetters,
    isLoading,
    hasError,
    isSubmitting,
    startRound,
    userGuess,
  } = useHangmanData();


  return (
    <GameBox title="Hangman">
      <Box sx={hangmanViewWrapper}>
        <Box sx={hangmanViewOverlay}>
          <Container maxWidth="xl">
            <Typography variant="h1" component="h1" sx={titleGame}>
              Hangman
            </Typography>
            <RoundContent round={round} isLoading={isLoading} hasError={hasError} onRetry={startRound}>
              {() => (
                <>
                  <Answer mask={mask} />
                  <Grid container>
                    <Grid item xs={12} md={6} sx={leftGrid}>
                      <Typography variant="h3" sx={sectionTitle}>
                        guess the champion
                      </Typography>
                      <Box sx={keyboardWrapperBox}>
                        <Keyboard disabled={isSubmitting} usedLetters={usedLetters} onLetterClick={userGuess} />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6} sx={rightGrid}>
                      <Typography variant="h3" sx={sectionTitle}>
                        Lives
                      </Typography>
                      <Lives maxAttempts={maxAttempts} wrongGuesses={wrongGuesses} />
                    </Grid>
                  </Grid>
                </>
              )}
            </RoundContent>
          </Container>
        </Box>
      </Box>
    </GameBox>
  );
};

export default Hangman;
