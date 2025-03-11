import React, { useState } from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import { colors } from "../../theme/colors";
import useRanking from "./useRanking";
import RankingTable from "./RankingTable";

const gameModes = ["Hangman", "Champions", "Skills", "Quote", "TotalScore"];

const Ranking = () => {
  const [activeTab, setActiveTab] = useState(0);
  const selectedMode = gameModes[activeTab];
  const { ranking } = useRanking(selectedMode);

  return (
    <Box
      sx={{
        backgroundColor: colors.background,
        color: colors.textPrimary,
        minHeight: "100vh",
        p: 4,
      }}
    >
      <Typography variant="h4" sx={{ mb: 4, color: colors.gold1 }}>
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
    </Box>
  );
};

const EmptyRankingMessage = () => (
  <Typography sx={{ color: colors.textSecondary, mt: 2, textAlign: "center" }}>
    No rankings available for this mode.
  </Typography>
);

export default Ranking;
