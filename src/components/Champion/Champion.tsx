import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Grid, Tab, Tabs, Typography } from "@mui/material";
import { characterService } from "../../api/characterService";
import { ChampionDetails } from "../../api/types";

import CustomTabPanel from "../CustomTabPanel/CustomTabPanel";

const Champion = () => {
  const { id } = useParams<{ id: string }>();
  const [champion, setChampion] = useState<ChampionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(0);

  const championImage: React.CSSProperties = {
    width: "100%",
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
        setLoading(false);
      } catch (error) {
        console.error(`Failed to fetch champion data ${error}`);
      }
    };
    if (id) {
      fetchChampion(id);
    }
  }, [id]);

  console.log(champion?.spells);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!champion) {
    return <div>Champion not found</div>;
  }

  return (
    <Box sx={{ marginTop: 12 }}>
      <Typography component="h1" variant="h3">
        {champion.name}
      </Typography>
      <Grid container spacing={{ xs: 1, sm: 6 }}>
        <Grid item xs={12} sm={6}>
          <img
            src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg`}
            alt={champion.name}
            style={championImage}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography padding="0 0 20px 0" component="h2" variant="h5">
            {champion.title}
          </Typography>
          <Typography component="p">{champion.lore}</Typography>
          <Typography padding="20px 0" component="h3" variant="h5">
            Skills
          </Typography>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={value} onChange={handleChange} scrollButtons="auto">
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
              <Typography component="h3" variant="h6">
                {spell.name}
              </Typography>
              <Typography component="p">{spell.description}</Typography>
            </CustomTabPanel>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Champion;
