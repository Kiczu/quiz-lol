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
        // inset rather than 100vw/100vh: viewport units include the scrollbar,
        // so the layer ends up wider than the visible area and shifts when the
        // scrollbar comes and goes.
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
