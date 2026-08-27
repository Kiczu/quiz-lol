import { Box, Button, Typography } from "@mui/material";
import { useEffect } from "react";
import { Link as ReactRouter } from "react-router-dom";

import backgroundMap from "../../assets/images/backgroundMap.jpg";
import { useBackground } from "../../context/BackgroundContext/BackgroundContext";
import { paths } from "../../paths";

import {
  notFoundButton,
  notFoundCode,
  notFoundDesc,
  notFoundOverlay,
  notFoundTitle,
  notFoundWrapper,
} from "./notFound.style";

const NotFound = () => {
  const { setImage } = useBackground();

  useEffect(() => {
    setImage(backgroundMap);
    return () => setImage(undefined);
  }, [setImage]);

  return (
    <Box sx={notFoundWrapper}>
      <Box sx={notFoundOverlay}>
        <Typography component="p" sx={notFoundCode}>
          404
        </Typography>
        <Typography component="h1" sx={notFoundTitle}>
          You have strayed off the map
        </Typography>
        <Typography sx={notFoundDesc}>
          This page does not exist in Runeterra. Head back and pick a game mode.
        </Typography>
        <Button component={ReactRouter} to={paths.HOME} sx={notFoundButton}>
          Back to home
        </Button>
      </Box>
    </Box>
  );
};

export default NotFound;
