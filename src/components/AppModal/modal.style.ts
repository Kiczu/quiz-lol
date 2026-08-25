import { colors } from "../../theme/colors";

export const modalDialogPaper = {
    position: "relative",
    background: "#010A13",
    border: "2px solid",
    borderImage: `${colors.accentGradient} 1`,
    boxShadow: "0 8px 32px 4px #000A  , 0 0 0 4px #785A2833",
    minWidth: { xs: 280, sm: 400 },
    maxWidth: { xs: "90vw", sm: 460 },
    padding: 2,
    overflow: "hidden",
}

export const modalTitleContainer = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
}
export const modalTitleBox = {
    display: "flex",
    alignItems: "center",
    gap: 1,
};

export const modalTitleTypography = {
    fontSize: "1.5rem",
    fontWeight: 700,
    lineHeight: 1.1,
};

export const modalTitleColor = (variant: string) =>
    variant === "success"
        ? colors.gold2
        : variant === "warning"
            ? colors.gold3
            : colors.error;

export const modalContent = {
    fontSize: "1.1rem",
    m: "20px 10px",
    color: colors.textPrimary
};