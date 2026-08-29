import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { Link as ReactRouter, useParams } from "react-router-dom";

import backgroundMap from "../../assets/images/backgroundMap.webp";
import { useBackground } from "../../context/BackgroundContext/BackgroundContext";
import { paths } from "../../paths";
import { characterService } from "../../services/characterService";
import { outlineButton } from "../../theme/buttons";

import {
  backgroundWrapper,
  centeredMessage,
  championImage,
  loader,
  overlay,
  title,
} from "./champion.style";
import SkillsTabs from "./SkillsTabs/SkillsTabs";
import { useChampionData } from "./useChampionData";

const Champion = () => {
  const { id } = useParams<{ id: string }>();
  const { champion, version, isLoading, hasError } = useChampionData(id);
  const { setImage } = useBackground();

  useEffect(() => {
    setImage(backgroundMap);
    return () => setImage(undefined);
  }, [setImage]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box sx={centeredMessage}>
          <CircularProgress sx={loader} />
        </Box>
      );
    }

    if (hasError || !champion || !version) {
      return (
        <Box sx={centeredMessage}>
          <Typography variant="h1" textAlign="center" sx={title}>
            {hasError ? "Could not load this champion" : "Champion not found"}
          </Typography>
          <Button component={ReactRouter} to={paths.LORE} sx={outlineButton}>
            Back to lore
          </Button>
        </Box>
      );
    }

    return (
      <>
        <Typography component="h1" variant="h1" sx={title}>
          {champion.name}
        </Typography>
        <Grid container spacing={{ xs: 1, sm: 6 }}>
          <Grid item xs={12} md={6}>
            <img
              src={characterService.getSplashUrl(champion.id)}
              alt={champion.name}
              style={championImage}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              pb={2}
              component="h2"
              variant="h2"
              sx={{ wordBreak: "break-word" }}
            >
              {champion.title}
            </Typography>
            <Typography
              component="p"
              sx={{ whiteSpace: "pre-line", wordBreak: "break-word" }}
            >
              {champion.lore}
            </Typography>
            <Typography padding="20px 0" component="h2" variant="h2">
              Skills
            </Typography>
            <SkillsTabs spells={champion.spells} version={version} />
          </Grid>
        </Grid>
      </>
    );
  };

  return (
    <Box sx={backgroundWrapper}>
      <Box sx={overlay}>
        <Container maxWidth="xl">{renderContent()}</Container>
      </Box>
    </Box>
  );
};

export default Champion;
