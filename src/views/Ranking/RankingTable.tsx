import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { colors } from "../../theme/colors";

interface RankingTableProps {
  ranking: { userId: string; score: number }[];
}

const RankingTable = ({ ranking }: RankingTableProps) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: colors.textPrimary }}>Rank</TableCell>
            <TableCell sx={{ color: colors.textPrimary }}>User ID</TableCell>
            <TableCell sx={{ color: colors.textPrimary }}>Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ranking.map((user, index) => (
            <TableRow key={user.userId}>
              <TableCell sx={{ color: colors.textSecondary }}>
                {index + 1}
              </TableCell>
              <TableCell sx={{ color: colors.textSecondary }}>
                {user.userId}
              </TableCell>
              <TableCell sx={{ color: colors.textSecondary }}>
                {user.score}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RankingTable;
