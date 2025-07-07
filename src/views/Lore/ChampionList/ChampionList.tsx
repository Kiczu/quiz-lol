import { Grid, Link, Box } from "@mui/material";
import { Link as ReactRouter } from "react-router-dom";
import { ChampionDetails } from "../../../api/types";
import { championCard, championImage, championNameBanner } from "../lore.style";

const ChampionList = ({ champions }: { champions: ChampionDetails[] }) => (
  <Grid container spacing={{ xs: 4, sm: 3, lg: 6 }}>
    {champions.map((champion) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={champion.id}>
        <Link component={ReactRouter} to={`/champions/${champion.id}`}>
          <Box sx={championCard}>
            <Box
              component="img"
              src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg`}
              alt={champion.name}
              sx={championImage}
              loading="lazy"
            />
            <Box sx={championNameBanner}>{champion.name}</Box>
          </Box>
        </Link>
      </Grid>
    ))}
  </Grid>
);

export default ChampionList;
