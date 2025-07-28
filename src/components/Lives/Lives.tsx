import { Box } from "@mui/material";

import ImpactGif from "../../assets/animations/impact.gif";
import minion from "../../assets/images/minion.webp";

import {
  ImpactAnimation,
  getLivesGrid,
  liveWrapper,
  MinionImg,
} from "./lives.style";

type Props = {
  maxAttempts: number;
  wrongGuesses: number;
  flex?: boolean;
  minionSize?: number;
};

const Lives = ({ maxAttempts, wrongGuesses, minionSize, flex }: Props) => (
  <Box sx={getLivesGrid(flex)}>
    {Array.from({ length: maxAttempts }, (_, i) => (
      <Box key={`minion${i}`} sx={liveWrapper}>
        <MinionImg
          className="MuiImageListItem-img"
          isActive={wrongGuesses > i}
          src={minion}
          alt="life"
          style={minionSize ? { maxWidth: minionSize, width: minionSize } : {}}
        />
        {wrongGuesses > i && (
          <ImpactAnimation
            className="MuiImageListItem-img"
            src={ImpactGif}
            alt=""
            style={minionSize ? { width: minionSize } : {}}
          />
        )}
      </Box>
    ))}
  </Box>
);

export default Lives;
