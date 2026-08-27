import { colors } from "../../theme/colors";
import { fill, fillColumn } from "../../theme/layout";

export const regionGameWrapper = {
    ...fillColumn,
    width: "100%",
};

export const regionGameOverlay = {
    ...fill,
    backdropFilter: "blur(4px)",
    backgroundColor: colors.overlayBackground,
    padding: {
        xs: "20px 0",
        sm: "20px 24px",
        md: "20px 60px",
        lg: "20px 80px",
    },
};

export const regionContainer = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    flexWrap: "wrap",
    gap: 2,
};

export const regionTitle = {
    color: colors.gold2,
    fontWeight: 700,
    mb: 1,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 2,
    fontSize: { xs: "1.3rem", sm: "2rem", md: "2.4rem" },
    textShadow: `0 1px 8px ${colors.gold3}`,
};

export const championImageStyle = {
    width: 140,
    height: 140,
    objectFit: "contain",
    borderRadius: "18px",
    border: `2px solid ${colors.gold2}`,
    background: "#10151d",
    boxShadow: `0 4px 18px 0 #212C40BB`,
    marginBottom: 4,
};

export const regionListWrapper = {
    mt: 3,
    width: "100%",
};
