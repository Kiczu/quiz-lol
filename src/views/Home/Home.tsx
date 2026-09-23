import { Box, Typography } from "@mui/material";

import hangmanIcon from "../../assets/images/modes/hangman.webp";
import pvpIcon from "../../assets/images/modes/pvp.webp";
import regionIcon from "../../assets/images/modes/region.webp";
import skillsIcon from "../../assets/images/modes/skill.webp";
import SelectModeCard from "../../components/SelectModeCard/SelectModeCard";
import { useAuth } from "../../context/LoginContext/LoginContext";
import { paths } from "../../paths";
import { useResponsiveColumns } from "../../utils/useResponsiveColumns";

import {
  homeHeroContainer,
  heroOverlay,
  modesContainer,
  subtitle,
  headline,
  homeColumns,
} from "./home.style";

type GameMode = {
  title: string;
  desc: string;
  img: string;
  link?: string;
};

const modes: GameMode[] = [
  {
    title: "Hangman",
    desc: "Classic game. Limited attempts. Can you guess?",
    link: paths.HANGMAN,
    img: hangmanIcon,
  },
  {
    title: "Regions",
    desc: "Match the region to the champion.",
    link: paths.REGION,
    img: regionIcon,
  },
  {
    title: "Skills",
    desc: "Match the skill to the champion.",
    link: paths.SKILLS,
    img: skillsIcon,
  },
  {
    title: "Player vs Player",
    desc: "Test your League knowledge against an online opponent.",
    link: paths.PVP,
    img: pvpIcon,
  },
];

const Home = () => {
  const { userData } = useAuth();
  const columns = useResponsiveColumns(homeColumns);

  return (
    <Box sx={homeHeroContainer}>
      <Box sx={heroOverlay}>
        {userData ? (
          <Typography component="h1" sx={headline}>
            Nice to see you again, {userData?.username}!
          </Typography>
        ) : (
          <Typography component="h1" sx={headline}>
            Welcome to the Queue Quiz!
          </Typography>
        )}
        <Typography component="h2" sx={subtitle}>
          Select mode below to start playing!
        </Typography>
        <Box sx={modesContainer}>
          {modes.map((mode, idx) => (
            <SelectModeCard
              key={mode.title}
              title={mode.title}
              desc={mode.desc}
              link={mode.link}
              img={mode.img}
              idx={idx}
              columns={columns}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
