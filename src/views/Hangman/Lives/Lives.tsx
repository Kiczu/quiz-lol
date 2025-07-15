import { Box } from "@mui/material";

import ImpactGif from "../../../assets/animations/impact.gif";
import minion from "../../../assets/images/minion.webp";

import {
  ImpactAnimation,
  livesGrid,
  liveWrapper,
  MinionImg,
} from "./lives.style";

type Props = {
  maxAttempts: number;
  wrongGuesses: number;
};

const Lives = ({ maxAttempts, wrongGuesses }: Props) => {
  return (
    <Box sx={livesGrid}>
      {Array.from({ length: maxAttempts }, (_, i) => (
        <Box key={`minion${i}`} sx={liveWrapper}>
          <MinionImg
            className="MuiImageListItem-img"
            isActive={wrongGuesses > i}
            src={minion}
            alt="life"
          />
          {wrongGuesses > i && (
            <ImpactAnimation
              className="MuiImageListItem-img"
              src={ImpactGif}
              alt=""
            />
          )}
        </Box>
      ))}
    </Box>
  );
};

export default Lives;
