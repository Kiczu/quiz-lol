import { Box, Container, Typography } from "@mui/material";

import backgroundMap from "../../assets/images/backgroundMap.webp";
import AnswerOptions from "../../components/AnswerOptions/AnswerOptions";
import GameBox from "../../components/GameBox/GameBox";
import RoundContent from "../../components/GameBox/RoundContent";
import Lives from "../../components/Lives/Lives";
import usePageBackground from "../../hooks/usePageBackground";
import { COLUMN_MAP } from "../../theme/config";
import { useResponsiveColumns } from "../../utils/useResponsiveColumns";

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
  usePageBackground(backgroundMap);
  const columns = useResponsiveColumns(COLUMN_MAP);


  return (
    <GameBox title="Skills">
      <Box sx={skillsGameWrapper}>
        <Box sx={skillsGameOverlay}>
          <Container maxWidth="xl" sx={skillsContainer}>
            <Typography variant="h2" sx={skillsTitle}>
              Which champion does this ability belong to?
            </Typography>
            <RoundContent round={round} isLoading={isLoading} hasError={hasError} onRetry={startRound}>
              {(round) => (
                <>
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
                    <AnswerOptions
                      disabled={isSubmitting}
                      options={round.options}
                      usedIds={usedChampions}
                      columns={columns}
                      onSelect={handleSelectChampion}
                    />
                  </Box>
                </>
              )}
            </RoundContent>
          </Container>
        </Box>
      </Box>
    </GameBox>
  );
};

export default SkillsGame;
