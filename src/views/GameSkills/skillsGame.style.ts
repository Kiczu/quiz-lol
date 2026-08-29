import { colors } from "../../theme/colors";
import { fill, fillColumn } from "../../theme/layout";

export const skillsGameWrapper = {
    ...fillColumn,
    width: "100%",
};

export const skillsGameOverlay = {
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

export const skillsContainer = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    gap: 2,
};

export const skillsTitle = {
    color: colors.gold2,
    fontWeight: 700,
    mb: 1,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 2,
};

export const spellIconStyle = {
    width: { xs: 96, sm: 120 },
    height: { xs: 96, sm: 120 },
    borderRadius: "50%",
    objectFit: "cover",
    border: `2px solid ${colors.gold2}`,
    boxShadow: `0 0 32px 4px ${colors.gold2}55`,
};

export const spellNameStyle = {
    color: colors.gold1,
    fontWeight: 700,
    letterSpacing: 2,
    textAlign: "center",
    textTransform: "uppercase",
};

export const optionsWrapper = {
    width: "100%",
    mt: 2,
};

export const loader = {
    color: colors.gold2,
};

export const errorMessage = {
    color: colors.textSecondary,
    textAlign: "center",
};
