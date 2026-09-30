import { Box, Button, Container, Typography } from "@mui/material";

import backgroundMap from "../../assets/images/backgroundMap.webp";
import SearchBar from "../../components/SearchBar/SearchBar";
import usePageBackground from "../../hooks/usePageBackground";
import { errorMessage } from "../../theme/layout";

import ChampionList from "./ChampionList/ChampionList";
import { loreViewHeader, loreViewOverlay, loreViewWrapper } from "./lore.style";
import { useLoreData } from "./useLoreData";

const Lore = () => {
  const { champions, search, isLoading, hasError, handleSearchChange, retry } = useLoreData();
  usePageBackground(backgroundMap);

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
          {hasError ? (
            <Box sx={errorMessage}>
              <Typography component="p">Could not load the champions. Please try again.</Typography>
              <Button onClick={retry}>Try again</Button>
            </Box>
          ) : (
            <ChampionList champions={champions} isLoading={isLoading} />
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default Lore;
