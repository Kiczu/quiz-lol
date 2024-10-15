import { Link } from "react-router-dom";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { ChampionDetails } from "../../../api/types";

const ChampionList = ({ champions }: { champions: ChampionDetails[] }) => {
  const championImage: React.CSSProperties = {
    width: "100%",
  };

  return (
    <Grid container spacing={{ xs: 6, sm: 3, lg: 10 }}>
      {champions.map((champion) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={champion.id}>
          <Link to={`/champions/${champion.id}`}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxShadow: 5,
              }}
            >
              <img
                style={championImage}
                src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg`}
                alt={champion.name}
                loading="lazy"
              />
              <CardContent style={{ flexGrow: 1 }}>
                <Typography
                  textAlign="center"
                  variant="h5"
                  component="div"
                  paddingBottom={1}
                >
                  {champion.name}
                </Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
};

export default ChampionList;
