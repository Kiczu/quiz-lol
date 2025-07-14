import { colors } from "../../theme/colors";
import backgroundMap from "../../assets/images/backgroundMap.jpg";

export const hangmanViewWrapper = {
  minHeight: "100vh",
  width: "100%",
  backgroundImage: `url(${backgroundMap})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};

export const hangmanViewOverlay = {
  minHeight: "100vh",
  backdropFilter: "blur(4px)",
  backgroundColor: colors.overlayBackground,
  padding: {
    xs: "20px 0",
    sm: "20px 24px",
    md: "20px 60px",
    lg: "20px 80px",
  },
};

export const titleGame = {
  textAlign: "center",
  textTransform: "uppercase",
  m: 4,
};

export const sectionTitle = {
  textAlign: "center",
  color: colors.gold2,
  fontWeight: 700,
  mb: 2,
  fontSize: "2rem",
  letterSpacing: 2,
  textTransform: "uppercase",
};

export const keyboardWrapperBox = {
  flexGrow: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
};

export const leftGrid = {
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  minHeight: "100%",
};

export const rightGrid = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  mt: { xs: 4, md: 0 },
  height: "100%",
};
