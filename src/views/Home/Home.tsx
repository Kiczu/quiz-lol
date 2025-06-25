import { Box, Typography } from "@mui/material";
import { paths } from "../../paths";
import {
  homeHeroContainer,
  heroOverlay,
  modesContainer,
  subtitle,
  headline,
} from "./homeStyles";
import { useAuth } from "../../context/LoginContext/LoginContext";
import SelectModeCard from "../../components/SelectModeCard/SelectModeCard";
import pvpImg from "../../assets/images/modes/pvp.jpg";
import regionImg from "../../assets/images/modes/region.png";
import skillsImg from "../../assets/images/modes/skill.jpg";
import hangmanImg from "../../assets/images/modes/hangman.jpg";

const Home = () => {
  const { userData } = useAuth();

  return (
    <>
      <Box sx={homeHeroContainer}>
        <Box sx={heroOverlay}>
          <Typography component="h1" sx={headline}>
            Welcome to the Quiz League of Legends!
          </Typography>
          <Typography component="h2" sx={subtitle}>
            Select mode below to start playing!
          </Typography>
          <Box sx={modesContainer}>
            <SelectModeCard
              title="Hangman"
              desc="Classic game. Limited attempts. Can you guess?"
              link={paths.HANGMAN}
              img={hangmanImg}
            />
            <SelectModeCard
              title="Regions"
              desc="Match the region to the champion."
              link="/classic"
              img={regionImg}
            />
            <SelectModeCard
              title="Skills"
              desc="Match the skill to the champion."
              link="/skills"
              img={skillsImg}
            />
            <SelectModeCard
              title="PVP"
              desc="Play vs players from all over the world."
              link="/quote"
              img={pvpImg}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Home;
