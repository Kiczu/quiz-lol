import { alpha } from "@mui/material";

import { colors } from "../../theme/colors";
import { fill } from "../../theme/layout";

export const inputStyle = {
    backgroundColor: "transparent",
    color: colors.textPrimary,
    mb: 2,
    borderRadius: 0,

    "& .MuiFormHelperText-root": {
        backgroundColor: "transparent",
        margin: 0,
        pt: 1,
    },
};

export const dashboardViewContainer = {
    ...fill,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
}

export const dashboardOverlay = {
    ...fill,
    backdropFilter: "blur(4px)",
    backgroundColor: alpha(colors.overlayBackground, 0.75),
    width: "100%",
}

export const dataFormsContainer = {
    display: "flex",
    flexDirection: "column",
    gap: 4,
}
export const glassPanel = {
    background: "rgba(28,34,48, 0.92)",
    borderRadius: "0px",
    boxShadow: `0 4px 32px 2px ${colors.gold2}22, 0 1px 8px #0008`,
    backdropFilter: "blur(6px)",
    transition: "border 0.18s, box-shadow 0.18s, background 0.2s",
    p: { xs: 2, sm: 3 },
    mb: 4,
};

export const scoresContainer = {
    background: `linear-gradient(90deg, ${colors.gold2} 60%, ${colors.gradientBlue} 100%)`,
    color: colors.grey3,
    borderRadius: "0px",
    boxShadow: `0 6px 24px 4px ${colors.gold2}55`,
    p: { xs: 2, sm: 4 },
    fontWeight: 700,
    fontSize: "1.5rem",
    textAlign: "center",
};
