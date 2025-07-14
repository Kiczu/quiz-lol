import { colors } from "../../../theme/colors";

export const keyboardButtonBase = (isUsed: boolean) => ({
    fontSize: { md: "1.2rem", lg: "1.5rem" },
    px: { sm: 2 },
    py: { sm: 1 },
    minWidth: { xs: 30, md: 35, lg: 50 },
    textTransform: "none",
    transition: "0.5s cubic-bezier(.34,1.56,.64,1)",
    color: isUsed ? colors.backgroundSecondary : colors.gold1,
    borderColor: isUsed ? colors.gold1 : colors.gold2,
    backgroundColor: isUsed ? colors.gold2 : "transparent",
    "&:hover": {
        backgroundColor: colors.gold2,
        borderColor: colors.gold1,
        color: colors.backgroundSecondary,
    },
});