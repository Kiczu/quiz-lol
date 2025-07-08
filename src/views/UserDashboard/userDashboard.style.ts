import { colors } from "../../theme/colors";

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
    backgroundColor: colors.background,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
}

export const dashboardOverlay = {
    minHeight: "100vh",
    backdropFilter: "blur(4px)",
    backgroundColor: "rgba(10, 20, 40 ,0.8)",
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
    boxShadow: "0 4px 32px 2px #C8AA6E22, 0 1px 8px #0008",
    backdropFilter: "blur(6px)",
    transition: "border 0.18s, box-shadow 0.18s, background 0.2s",
    p: { xs: 2, sm: 3 },
    mb: 4,
};

export const scoresContainer = {
    background: "linear-gradient(90deg, #C8AA6E 60%, #0AC8B9 100%)",
    color: "#1e2328",
    borderRadius: "0px",
    boxShadow: "0 6px 24px 4px #C8AA6E55",
    p: { xs: 2, sm: 4 },
    fontWeight: 700,
    fontSize: "1.5rem",
    textAlign: "center",
};
