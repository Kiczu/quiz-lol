import { Box, Container, Typography } from "@mui/material";

import backgroundMap from "../../assets/images/backgroundMap.webp";
import GameBox from "../../components/GameBox/GameBox";
import RoundContent from "../../components/GameBox/RoundContent";
import Lives from "../../components/Lives/Lives";
import usePageBackground from "../../hooks/usePageBackground";
import { COLUMN_MAP } from "../../theme/config";
import { useResponsiveColumns } from "../../utils/useResponsiveColumns";

import {
  regionGameWrapper,
  regionGameOverlay,
  regionContainer,
  regionTitle,
  championImageStyle,
  regionListWrapper,
} from "./regionGame.style";
import RegionList from "./RegionList/RegionList";
import useRegionGameData from "./useRegionGameData";

const RegionGame = () => {
  const {
    regions,
    round,
    wrongGuesses,
    maxAttempts,
    usedRegions,
    isLoading,
    hasError,
    isSubmitting,
    startRound,
    handleSelectRegion,
  } = useRegionGameData();
  usePageBackground(backgroundMap);
  const columns = useResponsiveColumns(COLUMN_MAP);


  return (
    <GameBox title="Regions">
      <Box sx={regionGameWrapper}>
        <Box sx={regionGameOverlay}>
          <Container maxWidth="xl" sx={regionContainer}>
            <Typography variant="h2" sx={regionTitle}>
              What region does this hero belong to?
            </Typography>
            <RoundContent round={round} isLoading={isLoading} hasError={hasError} onRetry={startRound}>
              {(round) => (
                <>
                  <Box sx={regionContainer}>
                    {round.championIcon && (
                      <Box
                        component="img"
                        src={round.championIcon}
                        alt={round.championName}
                        sx={championImageStyle}
                      />
                    )}
                    <Lives maxAttempts={maxAttempts} wrongGuesses={wrongGuesses} flex />
                  </Box>
                  <Box sx={regionListWrapper}>
                    <RegionList
                      disabled={isSubmitting}
                      regions={regions}
                      onSelect={handleSelectRegion}
                      columns={columns}
                      usedRegions={usedRegions}
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

export default RegionGame;
