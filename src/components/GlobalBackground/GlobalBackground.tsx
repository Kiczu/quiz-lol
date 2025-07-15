import { Box } from "@mui/material";

import { useBackground } from "../../context/BackgroundContext/BackgroundContext";

export const GlobalBackground = () => {
  const { image } = useBackground();
  if (!image) return null;
  return (
    <Box
      sx={{
        position: "fixed",
        zIndex: 0,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        pointerEvents: "none",
        userSelect: "none",
      }}
    />
  );
};

export default GlobalBackground;
