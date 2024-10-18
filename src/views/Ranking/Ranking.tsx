import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Tabs,
  Tab,
  Avatar,
} from "@mui/material";
import { colors } from "../../theme/colors";

const Ranking = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const rankingData = [
    { avatar: "A", name: "User1", score: 1200, rank: 1 },
    { avatar: "B", name: "User2", score: 1150, rank: 2 },
    { avatar: "C", name: "User3", score: 1100, rank: 3 },
  ];

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
        onChange={handleTabChange}
        sx={{ mb: 4, borderBottom: 1, borderColor: colors.grey2 }}
      >
        <Tab label="Mode 1" sx={{ color: colors.textPrimary }} />
        <Tab label="Mode 2" sx={{ color: colors.textPrimary }} />
        <Tab label="Mode 3" sx={{ color: colors.textPrimary }} />
        <Tab label="Total Score" sx={{ color: colors.gold3 }} />
      </Tabs>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: colors.textPrimary }}>Rank</TableCell>
              <TableCell sx={{ color: colors.textPrimary }}>Avatar</TableCell>
              <TableCell sx={{ color: colors.textPrimary }}>Username</TableCell>
              <TableCell sx={{ color: colors.textPrimary }}>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rankingData.map((user, index) => (
              <TableRow key={index}>
                <TableCell sx={{ color: colors.textSecondary }}>
                  {user.rank}
                </TableCell>
                <TableCell>
                  <Avatar sx={{ backgroundColor: colors.blue2 }}>
                    {user.avatar}
                  </Avatar>
                </TableCell>
                <TableCell sx={{ color: colors.textSecondary }}>
                  {user.name}
                </TableCell>
                <TableCell sx={{ color: colors.textSecondary }}>
                  {user.score}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Ranking;
