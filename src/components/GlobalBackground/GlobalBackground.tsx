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
        inset: 0,
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
