import { colors } from "./colors";
import { typography } from "./typography";

export const outlineButton = {
    fontFamily: `${typography.button.fontFamily}, sans-serif`,
    color: colors.gold1,
    border: `1px solid ${colors.gold4}`,
    borderRadius: 0,
    px: 4,
    py: 1,
    letterSpacing: 2,
    "&:hover": {
        borderColor: colors.gold2,
        backgroundColor: colors.gold5,
    },
}
