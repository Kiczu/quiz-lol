import { Link as ReactRouter } from "react-router-dom";
import { CardContent, Grid, Typography, Link } from "@mui/material";
import { ChampionDetails } from "../../../api/types";
import { ChampionCard } from "../../../muiComponentsStyles";

const ChampionList = ({ champions }: { champions: ChampionDetails[] }) => {
  const championImage = {
    width: "100%",
  };

  return (
    <Grid container spacing={{ xs: 6, sm: 3, lg: 10 }}>
      {champions.map((champion) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={champion.id}>
          <Link component={ReactRouter} to={`/champions/${champion.id}`}>
            <ChampionCard>
              <img
                style={championImage}
                src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg`}
                alt={champion.name}
                loading="lazy"
              />
              <CardContent sx={{ padding: 0, position: "relative" }}>
                <Typography
                  textAlign="center"
                  variant="h5"
                  component="p"
                  sx={{
                    position: "absolute",
                    bottom: -2,
                    bgcolor: "rgba(200, 155, 60, 0.8)",
                    backdropFilter: "blur(2px)",
                    padding: "10px 0",
                    width: "100%",
                  }}
                >
                  {champion.name}
                </Typography>
              </CardContent>
            </ChampionCard>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
};

export default ChampionList;
