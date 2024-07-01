import { Box, Typography } from "@mui/material";
import SouthIcon from "@mui/icons-material/South";
import { useAuth } from "../../context/LoginContext/LoginContext";
import logo from "../../assets/images/logo.png";
import heroImage from "../../assets/images/hero.jpg";
import { Link } from "react-router-dom";
import SelectModeCard from "../../components/SelectModeCard/SelectModeCard";

const Home = () => {
  const { userData } = useAuth();

  return (
    <>
      <Box
        sx={{
          position: "relative",
          backgroundImage: `url(${heroImage})`,
          backgroundPosition: "top center",
          backgroundSize: "cover",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            background: "linear-gradient(180deg, rgba(0,0,0,0), black);",
          }}
        >
          <Box
            component="img"
            alt="Logo"
            src={logo}
            sx={{ maxWidth: 400, width: "100%" }}
          />
          <Typography component="h1" sx={{ fontSize: "2rem", color: "white" }}>
            Welcome to the Quiz LOL!
          </Typography>
          <Typography
            component="h2"
            sx={{ fontSize: "1.5rem", color: "white", mt: 5 }}
          >
            Select mode below to start playing!
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          background: "black",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            transform: "translateY(-150px)",
          }}
        >
          <SelectModeCard
            title="Champions"
            desc="Play with friends"
            link="/classic"
            img="/assets/images/classic.jpg"
          />
          <SelectModeCard
            title="Skills"
            desc="Play with friends"
            link="/skills"
            img="/assets/images/skills.jpg"
          />
          <SelectModeCard
            title="Quote"
            desc="Play with friends"
            link="/quote"
            img="/assets/images/quote.jpg"
          />
          <SelectModeCard
            title="Hangman"
            desc="Play with friends"
            link="/hangman"
            img="/assets/images/hangman.jpg"
          />
        </Box>
      </Box>
    </>
  );
};

export default Home;
