import { Box, Container, Typography } from "@mui/material";
import { useEffect } from "react";

import backgroundMap from "../../assets/images/backgroundMap.webp";
import GameBox from "../../components/GameBox/GameBox";
import Lives from "../../components/Lives/Lives";
import { useBackground } from "../../context/BackgroundContext/BackgroundContext";
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
    championToGuess,
    championImage,
    wrongGuesses,
    maxAttempts,
    usedRegions,
    handleSelectRegion,
  } = useRegionGameData();
  const { setImage } = useBackground();
  const columns = useResponsiveColumns(COLUMN_MAP);

  useEffect(() => {
    setImage(backgroundMap);
    return () => setImage(undefined);
  }, [setImage]);

  return (
    <GameBox title="Regions">
      <Box sx={regionGameWrapper}>
        <Box sx={regionGameOverlay}>
          <Container maxWidth="xl" sx={regionContainer}>
            <Typography variant="h2" sx={regionTitle}>
              What region does this hero belong to?
            </Typography>
            <Box sx={regionContainer}>
              {championImage && (
                <Box
                  component="img"
                  src={championImage}
                  alt={championToGuess?.name}
                  sx={championImageStyle}
                />
              )}
              <Lives
                maxAttempts={maxAttempts}
                wrongGuesses={wrongGuesses}
                flex
              />
            </Box>
            <Box sx={regionListWrapper}>
              <RegionList
                regions={regions}
                onSelect={handleSelectRegion}
                columns={columns}
                usedRegions={usedRegions}
              />
            </Box>
          </Container>
        </Box>
      </Box>
    </GameBox>
  );
};

export default RegionGame;
