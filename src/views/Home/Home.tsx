import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { paths } from "../../paths";
import { useAuth } from "../../context/LoginContext/LoginContext";
import SelectModeCard from "../../components/SelectModeCard/SelectModeCard";
import pvpIcon from "../../assets/images/modes/pvp.jpg";
import regionIcon from "../../assets/images/modes/region.png";
import skillsIcon from "../../assets/images/modes/skill.jpg";
import hangmanIcon from "../../assets/images/modes/hangman.jpg";
import {
  homeHeroContainer,
  heroOverlay,
  modesContainer,
  subtitle,
  headline,
} from "./home.style";

const modes = [
  {
    title: "Hangman",
    desc: "Classic game. Limited attempts. Can you guess?",
    link: paths.HANGMAN,
    img: hangmanIcon,
  },
  {
    title: "Regions",
    desc: "Match the region to the champion.",
    link: "/classic",
    img: regionIcon,
  },
  {
    title: "Skills",
    desc: "Match the skill to the champion.",
    link: "/skills",
    img: skillsIcon,
  },
  {
    title: "PVP",
    desc: "Play vs players from all over the world.",
    link: "/quote",
    img: pvpIcon,
  },
];

const Home = () => {
  const { userData } = useAuth();

  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  let columns = 1;
  if (isMdUp) columns = 4;
  else if (isSmUp) columns = 2;

  return (
    <Box sx={homeHeroContainer}>
      <Box sx={heroOverlay}>
        <Typography component="h1" sx={headline}>
          Welcome to the Queue Quiz!
        </Typography>
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
