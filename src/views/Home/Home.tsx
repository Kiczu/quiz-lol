import { Box, Typography } from "@mui/material";
import { paths } from "../../paths";
import { heroImageContainer, overlayHeroImage } from "./heroImageStyles";
import { useAuth } from "../../context/LoginContext/LoginContext";
import SelectModeCard from "../../components/SelectModeCard/SelectModeCard";

const Home = () => {
  const { userData } = useAuth();

  return (
    <>
      <Box sx={heroImageContainer}>
        <Box sx={overlayHeroImage}>
          <Typography component="h1" sx={{ fontSize: "2rem", color: "white" }}>
            Welcome to the Quiz League of Legends!
          </Typography>
          <Typography
            component="h2"
            sx={{ fontSize: "1.5rem", color: "white", mt: 5 }}
          >
            Select mode below to start playing!
          </Typography>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-around",
              background: "transparent",
              mt: 5,
            }}
          >
            <SelectModeCard
              title="Guess the Region"
              desc="Play with friends"
              link={paths.REGION}
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
              link={paths.HANGMAN}
              img="/assets/images/hangman.jpg"
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Home;
