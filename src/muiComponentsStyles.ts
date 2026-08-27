import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { Button } from "@mui/material";

import { colors } from "./theme/colors";

export const shadowWave = keyframes`
0% {
      background-position: 0;
  }
  50% {
      background-position: 400%;
  }
  100% {
      background-position: 0;
  }
`;

export const WavingButton = styled(Button)({
    position: "relative",
    color: colors.textPrimary,
    fontSize: "1.2rem",
    letterSpacing: "4px",
    textTransform: "uppercase",
    fontWeight: "bold",
    background: colors.backgroundSecondary,
    border: `2px solid ${colors.gold2}`,
    borderRadius: 0,
    margin: "0 auto",
    padding: "15px 50px",
    transition: "box-shadow 2s",
    "&:before": {
        content: '""',
        position: "absolute",
        background: colors.backgroundSecondary,
        width: "100%",
        height: "100%",
        zIndex: "-1",
        borderRadius: "4px",
    },
    "&:after": {
        content: '""',
        position: "absolute",
        left: "-2px",
        top: "-2px",
        background: colors.goldWaveGradient,
        backgroundSize: "400%",
        width: "calc(100% + 4px)",
        height: "calc(100% + 4px)",
        zIndex: "-2",
        filter: "blur(10px)",
        animation: `${shadowWave} 40s linear infinite`,
    },
    // Not an identity transform: any transform makes the button a stacking
    // context, which pulls the z-index -1/-2 pseudo elements behind its own
    // background. That is what changes the glow on hover - do not remove.
    "&:hover": {
        transform: "scale(1)",
    },
});
