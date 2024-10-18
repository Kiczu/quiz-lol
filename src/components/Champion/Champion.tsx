import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Container, Grid, Tab, Tabs, Typography } from "@mui/material";
import { characterService } from "../../services/characterService";
import { ChampionDetails } from "../../api/types";
import backgroundMap from "../../assets/images/backgroundMap.jpg";
import CustomTabPanel from "../CustomTabPanel/CustomTabPanel";
import { colors } from "../../theme/colors";

const Champion = () => {
  const { id } = useParams<{ id: string }>();
  const [champion, setChampion] = useState<ChampionDetails | null>(null);
  const [value, setValue] = useState(0);

  const championImage = {
    width: "100%",
    boxShadow: `0 0 30px ${colors.gold2}`,
  };
  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchChampion = async (id: string) => {
      try {
        const data = await characterService.getChampion(id);
        setChampion(data);
      } catch (error) {
        console.error(`Failed to fetch champion data ${error}`);
      }
    };
    if (id) {
      fetchChampion(id);
    }
  }, [id]);

  if (!champion) {
    return <div>Champion not found</div>;
  }

  return (
    <Box
      sx={{
        backgroundImage: `url(${backgroundMap})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        minHeight: "90vh",
        width: "100%",
        position: "relative",
      }}
    >
      <Box
        sx={{
          minHeight: "90vh",
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(10, 20, 40 ,0.6)",
        }}
      >
        <Container maxWidth="xl">
          <Typography component="h1" variant="h1" sx={{ p: "30px 0" }}>
            {champion.name}
          </Typography>
          <Grid container spacing={{ xs: 1, sm: 6 }}>
            <Grid item sm={12} md={6}>
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg`}
                alt={champion.name}
                style={championImage}
              />
            </Grid>
            <Grid item sm={12} md={6}>
              <Typography pb={2} component="h2" variant="h2">
                {champion.title}
              </Typography>
              <Typography component="p">{champion.lore}</Typography>
              <Typography padding="20px 0" component="h2" variant="h2">
                Skills
              </Typography>
              <Box>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  scrollButtons="auto"
                  variant="scrollable"
                >
                  {champion.spells.map((spell, i) => (
                    <Tab
                      key={spell.id}
                      icon={
                        <img
                          src={`https://ddragon.leagueoflegends.com/cdn/14.13.1/img/spell/${spell.image.full}`}
                          alt={spell.name}
                        />
                      }
                      {...a11yProps(i)}
                    />
                  ))}
                </Tabs>
              </Box>
              {champion.spells.map((spell, i) => (
                <CustomTabPanel value={value} index={i}>
                  <Typography
                    component="p"
                    sx={{
                      fontWeight: "bold",
                      color: colors.gold2,
                      fontSize: "1.3rem",
                    }}
                  >
                    {spell.name}
                  </Typography>
                  <Typography component="p">{spell.description}</Typography>
                </CustomTabPanel>
              ))}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Champion;
