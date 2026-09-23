import { Box, Button, Typography } from "@mui/material";
import { Link as ReactRouter } from "react-router-dom";

import backgroundMap from "../../assets/images/backgroundMap.webp";
import usePageBackground from "../../hooks/usePageBackground";
import { paths } from "../../paths";
import { outlineButton } from "../../theme/buttons";

import {
  notFoundCode,
  notFoundDesc,
  notFoundOverlay,
  notFoundTitle,
  notFoundWrapper,
} from "./notFound.style";

const NotFound = () => {
  usePageBackground(backgroundMap);

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
        <Button component={ReactRouter} to={paths.HOME} sx={outlineButton}>
          Back to home
        </Button>
      </Box>
    </Box>
  );
};

export default NotFound;
