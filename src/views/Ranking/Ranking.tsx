import { Box, Typography, Tabs, Tab, Container } from "@mui/material";
import { useEffect, useState } from "react";

import backgroundMap from "../../assets/images/backgroundMap.jpg";
import { useBackground } from "../../context/BackgroundContext/BackgroundContext";
import { colors } from "../../theme/colors";

import {
  rankignOverlay,
  rankingContainer,
  rankingHeader,
} from "./ranking.style";
import RankingTable from "./RankingTable";
import useRanking from "./useRanking";


const gameModes = ["Hangman", "Champions", "Skills", "Quote", "TotalScore"];

const Ranking = () => {
  const [activeTab, setActiveTab] = useState(0);
  const selectedMode = gameModes[activeTab];
  const { ranking } = useRanking(selectedMode);
  const { setImage } = useBackground();

  useEffect(() => {
    setImage(backgroundMap);
    return () => setImage(undefined);
  }, [setImage]);

  return (
    <Box sx={rankingContainer}>
      <Box sx={rankignOverlay}>
        <Container maxWidth="xl">
          <Typography variant="h1" component="h1" sx={rankingHeader}>
            User Rankings
          </Typography>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{ mb: 4, borderBottom: 1, borderColor: colors.grey2 }}
          >
            {gameModes.map((mode, index) => (
              <Tab
                key={mode}
                label={mode}
                sx={{
                  color:
                    index === gameModes.length - 1
                      ? colors.gold3
                      : colors.textPrimary,
                }}
              />
            ))}
          </Tabs>
          {ranking.length > 0 ? (
            <RankingTable ranking={ranking} />
          ) : (
            <EmptyRankingMessage />
          )}
        </Container>
      </Box>
    </Box>
  );
};

const EmptyRankingMessage = () => (
  <Typography sx={{ color: colors.textSecondary, mt: 2, textAlign: "center" }}>
    No rankings available for this mode.
  </Typography>
);

export default Ranking;
