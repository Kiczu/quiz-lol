import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { colors } from "../../theme/colors";
import { getRankingWrapperSx, rankingTable } from "./ranking.style";

interface RankingTableProps {
  ranking: { userId: string; username: string; score: number }[];
}
const RankingTable = ({ ranking }: RankingTableProps) => {
  return (
    <Box sx={getRankingWrapperSx(1, 0, 2)}>
      <TableContainer sx={rankingTable}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: colors.textPrimary }}>Rank</TableCell>
              <TableCell sx={{ color: colors.textPrimary }}>Username</TableCell>
              <TableCell sx={{ color: colors.textPrimary }}>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ranking.map((user, index) => (
              <TableRow key={index}>
                <TableCell sx={{ color: colors.textSecondary }}>
                  {index + 1}
                </TableCell>
                <TableCell sx={{ color: colors.textSecondary }}>
                  {user.username}
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

export default RankingTable;
