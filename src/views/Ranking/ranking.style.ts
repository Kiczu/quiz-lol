import { colors } from "../../theme/colors"
import { getMultiColumnGradientSx } from "../../utils/gradient";

export const rankingContainer = {
    backgroundColor: colors.background,
    color: colors.textPrimary,
    minHeight: "100vh",
}

export const rankignOverlay = {
    minHeight: "100vh",
    backdropFilter: "blur(4px)",
    backgroundColor: colors.overlayBackground,
    padding: {
        xs: "20px 0",
        sm: "20px 24px",
        md: "20px 60px",
        lg: "20px 80px"
    },
}

export const rankingHeader = {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    textAlign: "center",
    m: 4,
}

export const rankingTable = {
    background: "rgba(10, 20, 40, 0.95)"
}

export const getRankingWrapperSx = (columns: number, idx: number, border = 2) => ({
    ...getMultiColumnGradientSx(columns, idx, colors.accentGradient),
    borderRadius: 0,
    p: `${border}px`,
    boxSizing: "border-box",
});
