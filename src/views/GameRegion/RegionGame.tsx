import { Alert, Button, Box, CircularProgress, Container, Typography } from "@mui/material";
import { useEffect } from "react";

import backgroundMap from "../../assets/images/backgroundMap.webp";
import GameBox from "../../components/GameBox/GameBox";
import Lives from "../../components/Lives/Lives";
import { useBackground } from "../../context/BackgroundContext/BackgroundContext";
import { COLUMN_MAP } from "../../theme/config";
import { errorMessage, loader } from "../../theme/layout";
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
    );
  };

  return (
    <GameBox title="Regions">
      <Box sx={regionGameWrapper}>
        <Box sx={regionGameOverlay}>
          <Container maxWidth="xl" sx={regionContainer}>
            <Typography variant="h2" sx={regionTitle}>
              What region does this hero belong to?
            </Typography>
            {renderRound()}
          </Container>
        </Box>
      </Box>
    </GameBox>
  );
};

export default RegionGame;
