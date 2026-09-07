import { Box, CircularProgress, Container, Grid, Typography } from "@mui/material";

import GameBox from "../../components/GameBox/GameBox";
import Lives from "../../components/Lives/Lives";
import { errorMessage, loader } from "../../theme/layout";

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
    userGuess,
  } = useHangmanData();

  const renderRound = () => {
    if (isLoading) {
      return <CircularProgress sx={loader} />;
    }

    if (hasError || !round) {
      return (
        <Typography component="p" sx={errorMessage}>
          Could not load a champion. Try starting a new game.
        </Typography>
      );
    }

    return (
      <>
        <Answer mask={mask} />
        <Grid container>
          <Grid item xs={12} md={6} sx={leftGrid}>
            <Typography variant="h3" sx={sectionTitle}>
              guess the champion
            </Typography>
            <Box sx={keyboardWrapperBox}>
              <Keyboard usedLetters={usedLetters} onLetterClick={userGuess} />
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
    );
  };

  return (
    <GameBox title="Hangman">
      <Box sx={hangmanViewWrapper}>
        <Box sx={hangmanViewOverlay}>
          <Container maxWidth="xl">
            <Typography variant="h1" component="h1" sx={titleGame}>
              Hangman
            </Typography>
            {renderRound()}
          </Container>
        </Box>
      </Box>
    </GameBox>
  );
};

export default Hangman;
