import styled from "@emotion/styled";
import { keyframes, SxProps, Theme } from "@mui/material";

const impact = keyframes`
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
`;

export const MinionImg = styled.img<{ isActive: boolean }>`
  opacity: ${(prop) => (prop.isActive ? 0.5 : 1)};
  filter: ${(prop) => (prop.isActive ? "grayscale(100%)" : "grayscale(0%)")};
  z-index: 1;
  width: 100%;
  max-width: 150px;
  height: auto;
  transition: filter 0.2s, opacity 0.2s;
`;

export const ImpactAnimation = styled.img`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 150px;
  pointer-events: none;
  animation: ${impact} 1s ease-in-out forwards;
  z-index: 2;
`;

export const getLivesGrid = (flex: boolean = false): SxProps<Theme> => flex
  ? {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 1,
  }
  : {
    display: "grid",
    gridTemplateColumns: {
      xs: "repeat(2, 1fr)",
      sm: "repeat(3, 1fr)",
    },
    gap: 2,
    width: { xs: "100%", sm: 450, md: 450 },
    maxWidth: "100%",
    minHeight: { xs: 120, sm: 180, md: 220 },
    justifyItems: "center",
    alignItems: "center",
    margin: "0 auto",
  };

export const liveWrapper = {
  position: "relative",
  width: "100%",
  display: "flex",
  justifyContent: "center",
}

