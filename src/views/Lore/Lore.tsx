import { Box, Container, Typography } from "@mui/material";
import { useEffect } from "react";

import backgroundMap from "../../assets/images/backgroundMap.jpg";
import SearchBar from "../../components/SearchBar/SearchBar";
import { useBackground } from "../../context/BackgroundContext/BackgroundContext";

import ChampionList from "./ChampionList/ChampionList";
import { loreViewHeader, loreViewOverlay, loreViewWrapper } from "./lore.style";
import { useLoreData } from "./useLoreData";

const Lore = () => {
  const { champions, search, handleSearchChange } = useLoreData();
  const { setImage } = useBackground();

  useEffect(() => {
    setImage(backgroundMap);
    return () => setImage(undefined);
  }, [setImage]);

  return (
    <Box sx={loreViewWrapper}>
      <Box sx={loreViewOverlay}>
        <Container maxWidth="xl">
          <Box sx={loreViewHeader}>
            <Typography variant="h1" component="h1">
              League of Legends Lore
            </Typography>
            <SearchBar
              initSearch={search}
              handleSearchChange={handleSearchChange}
              delay={500}
            />
          </Box>
          <ChampionList champions={champions} />
        </Container>
      </Box>
    </Box>
  );
};

export default Lore;
