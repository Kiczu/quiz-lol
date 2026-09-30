import { Grid, Link, Box, Skeleton, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { Link as ReactRouter } from "react-router-dom";

import { ChampionDetails } from "../../../api/types";
import { characterService } from "../../../services/characterService";
import {
  championCard,
  championCardFrame,
  championImage,
  championImagePlaceholder,
  championNameSkeleton,
  getBannerSx,
} from "../lore.style";

const skeletonCount = 12;

const ChampionCard = ({ champion, columns, idx }: { champion: ChampionDetails; columns: number; idx: number }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Link
      component={ReactRouter}
      to={`/champions/${champion.id}`}
      underline="none"
    >
      <Box sx={championCard}>
        {!isLoaded && <Skeleton variant="rectangular" animation="wave" sx={championImagePlaceholder} />}
        <Box
          component="img"
          src={characterService.getSplashUrl(champion.id)}
          alt={champion.name}
          sx={{ ...championImage, opacity: isLoaded ? 1 : 0 }}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsLoaded(true)}
        />
        <Box sx={getBannerSx(columns, idx)}>{champion.name}</Box>
      </Box>
    </Link>
  );
};

const ChampionList = ({ champions, isLoading }: { champions: ChampionDetails[]; isLoading: boolean }) => {
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
      {isLoading
        ? Array.from({ length: skeletonCount }, (_, idx) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
            <Box sx={championCardFrame} aria-hidden>
              <Skeleton variant="rectangular" animation="wave" sx={championImagePlaceholder} />
              <Box sx={getBannerSx(COLUMNS, idx)}>
                <Skeleton variant="text" animation="wave" sx={championNameSkeleton} />
              </Box>
            </Box>
          </Grid>
        ))
        : champions.map((champion, idx) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={champion.id}>
            <ChampionCard champion={champion} columns={COLUMNS} idx={idx} />
          </Grid>
        ))}
    </Grid>
  );
};

export default ChampionList;
