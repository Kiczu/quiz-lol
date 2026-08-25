import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";

import {
  getRankingWrapperSx,
  rankingTable,
  rankingTableContent,
  getRankCellSx,
  getUsernameCellSx,
  getAvatarSx,
  getScoreCellSx,
  getRowMotionProps,
  rankingTableCell,
  rankingTableRow,
  getTableRowSx,
} from "./ranking.style";

interface RankingTableProps {
  ranking: {
    userId: string;
    username: string;
    score: number;
    avatar?: string;
  }[];
}
const RankingTable = ({ ranking }: RankingTableProps) => {
  return (
    <Box sx={getRankingWrapperSx(1, 0, 2)}>
      <TableContainer sx={rankingTable}>
        <Table sx={rankingTableContent}>
          <TableHead>
            <TableRow sx={rankingTableRow}>
              <TableCell sx={rankingTableCell}>Rank</TableCell>
              <TableCell sx={rankingTableCell}>Username</TableCell>
              <TableCell sx={rankingTableCell} align="right">
                Score
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ranking.map((user, index) => {
              const isLast = index === ranking.length - 1;
              return (
                <TableRow
                  component={motion.tr}
                  {...getRowMotionProps(index)}
                  sx={getTableRowSx(isLast)}
                  key={user.userId}
                >
                  <TableCell
                    sx={{ ...getRankCellSx(index), borderBottom: "none" }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell
                    sx={{ ...getUsernameCellSx, borderBottom: "none" }}
                  >
                    <Avatar
                      src={user.avatar}
                      sx={getAvatarSx(index)}
                      alt={user.username}
                    />
                    <Typography fontSize={18}>{user.username}</Typography>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ ...getScoreCellSx(index), borderBottom: "none" }}
                  >
                    {user.score}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RankingTable;
