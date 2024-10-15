import { Box, Typography } from "@mui/material";
import ChampionList from "./ChampionList/ChampionList";
import SearchBar from "../../components/SearchBar/SearchBar";
import { useLoreData } from "./useLoreData";
import backgroundMap from "../../assets/images/backgroundMap.jpg";

const Lore = () => {
  const { champions, search, handleSearchChange } = useLoreData();

  return (
    <Box
      sx={{
        backgroundImage: `url(${backgroundMap})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <Box
        sx={{
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(10, 20, 40 ,0.6)",
          padding: "20px 80px",
        }}
      >
        <Typography variant="h4" component="h1">
          LORE
        </Typography>
        <SearchBar
          initSearch={search}
          handleSearchChange={handleSearchChange}
          delay={500}
        />
        <ChampionList champions={champions} />
      </Box>
    </Box>
  );
};

export default Lore;
