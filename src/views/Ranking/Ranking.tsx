import { Box, Typography, Tabs, Tab, Container } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import backgroundMap from "../../assets/images/backgroundMap.jpg";
import { useBackground } from "../../context/BackgroundContext/BackgroundContext";
import { colors } from "../../theme/colors";

import {
  rankingOverlay,
  rankingContainer,
  rankingHeader,
} from "./ranking.style";
import RankingTable from "./RankingTable";
import useRanking from "./useRanking";

const gameModes = ["Hangman", "Regions", "Skills", "PVP", "TotalScore"];

const Ranking = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [direction, setDirection] = useState(0);
  const selectedMode = gameModes[activeTab];
  const { ranking } = useRanking(selectedMode);
  const { setImage } = useBackground();

  useEffect(() => {
    setImage(backgroundMap);
    return () => setImage(undefined);
  }, [setImage]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setDirection(newValue > activeTab ? 1 : -1);
    setActiveTab(newValue);
  };

  return (
    <Box sx={rankingContainer}>
      <Box sx={rankingOverlay}>
        <Container maxWidth="xl">
          <Typography variant="h1" component="h1" sx={rankingHeader}>
            User Rankings
          </Typography>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
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
          <AnimatePresence mode="wait" initial={false}>
            {ranking.length > 0 ? (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: direction > 0 ? 120 : -120 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 0.36 } }}
                exit={{
                  opacity: 0,
                  x: direction > 0 ? -120 : 120,
                  transition: { duration: 0.32 },
                }}
                style={{ width: "100%" }}
              >
                <RankingTable ranking={ranking} />
              </motion.div>
            ) : (
              <EmptyRankingMessage key={"empty-" + activeTab} />
            )}
          </AnimatePresence>
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
