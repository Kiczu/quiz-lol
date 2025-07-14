import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { characterService } from "../../services/characterService";
import { useBackground } from "../../context/BackgroundContext/BackgroundContext";
import { ChampionDetails } from "../../api/types";
import { paths } from "../../paths";
import SkillsTabs from "./SkillsTabs/SkillsTabs";
import {
  backgroundWrapper,
  overlay,
  championImage,
  title,
  backToLoreButton,
} from "./champion.style";
import backgroundMap from "../../assets/images/backgroundMap.jpg";

const Champion = () => {
  const { id } = useParams<{ id: string }>();
  const [champion, setChampion] = useState<ChampionDetails | null>(null);
  const { setImage } = useBackground();
  const navigate = useNavigate();

  useEffect(() => {
    setImage(backgroundMap);
    return () => setImage(undefined);
  }, [setImage]);

  useEffect(() => {
    if (id) {
      characterService.getChampion(id).then(setChampion).catch(console.error);
    }
  }, [id]);

  return (
    <Box sx={backgroundWrapper}>
      <Box sx={overlay}>
        <Container maxWidth="xl">
          {!champion ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h1" textAlign="center" sx={title}>
                Champion not found
              </Typography>
              <Button
                variant="contained"
                sx={backToLoreButton}
                onClick={() => navigate(paths.LORE)}
              >
                BACK TO LORE
              </Button>
            </Box>
          ) : (
            <>
              <Typography component="h1" variant="h1" sx={title}>
                {champion.name}
              </Typography>
              <Grid container spacing={{ xs: 1, sm: 6 }}>
                <Grid item xs={12} md={6}>
                  <img
                    src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg`}
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
                  <SkillsTabs spells={champion.spells} />
                </Grid>
              </Grid>
            </>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default Champion;
