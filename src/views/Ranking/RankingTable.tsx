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
  ranking: { userId: string; username: string; score: number }[];
}
const RankingTable = ({ ranking }: RankingTableProps) => {
  console.log(ranking);
  return (
    <TableContainer component={Paper}>
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
  );
};

export default RankingTable;
