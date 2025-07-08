import { useEffect } from "react";
import { Box, Container, Typography } from "@mui/material";
import { useLoreData } from "./useLoreData";
import ChampionList from "./ChampionList/ChampionList";
import SearchBar from "../../components/SearchBar/SearchBar";
import { useBackground } from "../../context/BackgroundContext/BackgroundContext";
import backgroundMap from "../../assets/images/backgroundMap.jpg";
import { loreViewHeader, loreViewOverlay, loreViewWrapper } from "./lore.style";

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
