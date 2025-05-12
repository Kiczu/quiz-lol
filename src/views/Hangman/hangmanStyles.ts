import styled from "@emotion/styled"
import { keyframes } from "@mui/material";

type MinionProps = {
  isActive: boolean;
}

export const boxContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: "#010A13",
  minHeight: "100vh",
}
export const titleGame = {
  fontWeight: "bold",
  textTransform: "uppercase",
  color: "#C89B3C",
  margin: "40px",
}

const impact = keyframes`
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

export const MinionImg = styled.img<MinionProps>`
              opacity: ${prop => prop.isActive ? 0.5 : 1};
              filter:  ${prop => prop.isActive ? 'grayscale(100%)' : 'grayscale(0%)'};
              z-index: 1;
`
export const ImpactAnimation = styled.img`
                position: absolute;
                bottom: 0;
                animation: ${impact} 1s ease-in-out forwards;
                z-index: 0;
`