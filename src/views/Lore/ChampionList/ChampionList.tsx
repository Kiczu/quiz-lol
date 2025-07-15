import { Grid, Link, Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link as ReactRouter } from "react-router-dom";

import { ChampionDetails } from "../../../api/types";
import { championCard, championImage, getBannerSx } from "../lore.style";

const ChampionList = ({ champions }: { champions: ChampionDetails[] }) => {
  const theme = useTheme();

  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  let COLUMNS = 1;
  if (isLgUp) COLUMNS = 4;
  else if (isMdUp) COLUMNS = 3;
  else if (isSmUp) COLUMNS = 2;

  return (
    <Grid container spacing={{ xs: 4, sm: 3, lg: 6 }}>
      {champions.map((champion, idx) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={champion.id}>
          <Link
            component={ReactRouter}
            to={`/champions/${champion.id}`}
            underline="none"
          >
            <Box sx={championCard}>
              <Box
                component="img"
                src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg`}
                alt={champion.name}
                sx={championImage}
                loading="lazy"
              />
              <Box sx={getBannerSx(COLUMNS, idx)}>{champion.name}</Box>
            </Box>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
};

export default ChampionList;
