import { Alert, Button, Box, CircularProgress, Container, Typography } from "@mui/material";
import { useEffect } from "react";

import backgroundMap from "../../assets/images/backgroundMap.webp";
import GameBox from "../../components/GameBox/GameBox";
import Lives from "../../components/Lives/Lives";
import { useBackground } from "../../context/BackgroundContext/BackgroundContext";
import { COLUMN_MAP } from "../../theme/config";
import { errorMessage, loader } from "../../theme/layout";
import { useResponsiveColumns } from "../../utils/useResponsiveColumns";

import ChampionOptions from "./ChampionOptions/ChampionOptions";
import {
  optionsWrapper,
  skillsContainer,
  skillsGameOverlay,
  skillsGameWrapper,
  skillsTitle,
  spellIconStyle,
  spellNameStyle,
} from "./skillsGame.style";
import useSkillsGameData from "./useSkillsGameData";

const SkillsGame = () => {
  const {
    round,
    wrongGuesses,
    maxAttempts,
    usedChampions,
    isLoading,
    hasError,
    isSubmitting,
    startRound,
    handleSelectChampion,
  } = useSkillsGameData();
  const { setImage } = useBackground();
  const columns = useResponsiveColumns(COLUMN_MAP);

  useEffect(() => {
    setImage(backgroundMap);
    return () => setImage(undefined);
  }, [setImage]);

  const renderRound = () => {
    if (isLoading) {
      return <CircularProgress sx={loader} />;
    }

    if (!round) {
      return (
        <Box sx={errorMessage}>
          <Typography component="p">Could not load a round. Please try again.</Typography>
          <Button onClick={startRound}>Try again</Button>
        </Box>
      );
    }

    return (
      <>
        {hasError && <Alert severity="error">Could not send your answer. Choose it again to retry.</Alert>}
        <Box
          component="img"
          src={round.spellIcon}
          alt={round.spellName}
          sx={spellIconStyle}
        />
        <Typography component="h3" sx={spellNameStyle}>
          {round.spellName}
        </Typography>
        <Lives maxAttempts={maxAttempts} wrongGuesses={wrongGuesses} flex />
        <Box sx={optionsWrapper}>
          <ChampionOptions
            disabled={isSubmitting}
            options={round.options}
            usedChampions={usedChampions}
            columns={columns}
            onSelect={handleSelectChampion}
          />
        </Box>
      </>
    );
  };

  return (
    <GameBox title="Skills">
      <Box sx={skillsGameWrapper}>
        <Box sx={skillsGameOverlay}>
          <Container maxWidth="xl" sx={skillsContainer}>
            <Typography variant="h2" sx={skillsTitle}>
              Which champion does this ability belong to?
            </Typography>
            {renderRound()}
          </Container>
        </Box>
      </Box>
    </GameBox>
  );
};

export default SkillsGame;
