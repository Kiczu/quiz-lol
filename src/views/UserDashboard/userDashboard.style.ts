import { colors } from "../../theme/colors";

export const inputStyle = {
    backgroundColor: colors.backgroundSecondary,
    color: colors.textPrimary,
    mb: 2,
        "& .MuiFormHelperText-root": {
        backgroundColor: colors.background,
        margin: 0,
        pt: 1,
    },
};

export const dashboardViewContainer = {
    backgroundColor: colors.background,
    color: colors.textPrimary,
    minHeight: "100vh",
    p: 4,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    "@media (max-width: 600px)": {
        p: 2,
    },
}

export const dataFormsContainer = {
    display: "flex",
    flexDirection: "column",
    gap: 4,
}
