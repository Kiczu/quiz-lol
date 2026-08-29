import { colors } from "../../../theme/colors";
import { typography } from "../../../theme/typography";
import { getMultiColumnGradientSx } from "../../../utils/gradient";

export const getOptionWrapperSx = (
    columns: number,
    idx: number,
    isUsed: boolean
) => ({
    ...getMultiColumnGradientSx(columns, idx, colors.accentGradient),
    p: "2px",
    display: "block",
    cursor: isUsed ? "not-allowed" : "pointer",
    transition: "transform .2s, box-shadow .2s",
    ...(isUsed
        ? {
            opacity: 0.5,
            filter: "grayscale(0.8)",
            pointerEvents: "none",
        }
        : {
            "&:hover": {
                transform: "translateY(-6px)",
                boxShadow: `0 0 32px 6px ${colors.gold2}44`,
            },
            "&:active": {
                transform: "scale(0.97)",
            },
        }),
});

export const optionCard = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
    background: colors.backgroundSecondary,
    p: 2,
    minHeight: 140,
};

export const optionIcon = {
    width: 64,
    height: 64,
    borderRadius: "50%",
    border: `1px solid ${colors.gold4}`,
};

export const optionName = {
    fontFamily: `${typography.button.fontFamily}, sans-serif`,
    color: colors.gold1,
    fontWeight: 700,
    letterSpacing: 1,
    textAlign: "center",
};
