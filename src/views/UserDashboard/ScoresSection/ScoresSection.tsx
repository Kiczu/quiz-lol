import { Grid, Card, CardContent, Typography } from "@mui/material";
import { ScoresMap } from "../../../api/types";
import { scoreCard, totalScoreCard } from "./scoreSection.style";

interface Props {
  scores: ScoresMap[] | null;
}

const ScoresSection = ({ scores }: Props) => {
  const totalScore =
    scores?.reduce((total, { score }) => total + score, 0) || 0;

  return (
    <Grid container spacing={4}>
      {scores?.map(({ gameId, score }, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card sx={scoreCard}>
            <CardContent>
              <Typography variant="h5">{gameId}</Typography>
              <Typography component="p" variant="h5" mt={1}>
                {score}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={totalScoreCard}>
          <CardContent>
            <Typography variant="h5">Total Score</Typography>
            <Typography component="p" variant="h5" mt={1}>
              {totalScore > 0 ? totalScore : "No scores yet"}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ScoresSection;
