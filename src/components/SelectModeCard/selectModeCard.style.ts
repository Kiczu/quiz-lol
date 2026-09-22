import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { getMultiColumnGradientSx } from "../../utils/gradient";

export const linkCardContainer = {
    display: "flex",
    minWidth: 0,
    height: "100%",
    transition: "transform 0.18s cubic-bezier(.34,1.56,.64,1)",
    "&:hover": {
        transform: "translateY(-6px) scale(1.035)",
        boxShadow: `0 8px 46px 6px ${colors.gold2}44, 0 1px 8px #0004`,
    },
    "&:focus-visible": {
        outline: `2px solid ${colors.gold2}`,
        outlineOffset: 4,
    },
}

export const modeCard = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
    minWidth: 0,
    width: "100%",
    boxSizing: "border-box",
    gap: 1.5,
    background: `${colors.background}`,
    boxShadow: "0 4px 32px 2px rgba(20,20,30,0.14)",
    padding: { xs: "24px 16px", sm: "28px 20px" },
    minHeight: { xs: 220, sm: 260, lg: 300 },
    overflow: "hidden",
    backdropFilter: "blur(8px)",
    position: "relative",
    transition: "box-shadow 0.18s",
    zIndex: 2,
}
export const getModeCardWrapperSx = (columns: number, idx: number, border: number) => ({
    ...getMultiColumnGradientSx(columns, idx, colors.accentGradient),
    borderRadius: 16,
    p: `${border}px`,
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minWidth: 0,
    boxSizing: "border-box",
    position: "relative",
});

export const modeImg = {
    width: { xs: 60, sm: 70, md: 80, lg: 90 },
    height: { xs: 60, sm: 70, md: 80, lg: 90 },
    borderRadius: "50%",
    boxShadow: `0 0 0 2px ${colors.gold2}99`,
    objectFit: "cover",
    mb: 1,
    flexShrink: 0,
    transition: "box-shadow 0.2s",
    zIndex: 2,
}

export const modeTitle = {
    fontFamily: `${typography.h3.fontFamily}, sans-serif`,
    fontSize: { xs: "1.25rem", sm: "1.4rem" },
    fontWeight: 700,
    color: colors.gold2,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    textAlign: "center",
    mb: 1,
    lineHeight: 1.16,
    overflowWrap: "anywhere",
    zIndex: 2,
}

export const modeDesc = {
    color: colors.textSecondary,
    fontSize: { xs: "0.95rem", sm: "1rem" },
    lineHeight: 1.5,
    textAlign: "center",
    fontFamily: `${typography.fontFamily}, sans-serif`,
    maxWidth: "240px",
    zIndex: 2,
}
export const disabledCardContainer = {
    display: "flex",
    minWidth: 0,
    height: "100%",
    cursor: "default",
}

export const modeCardDisabled = {
    opacity: 0.55,
    filter: "grayscale(0.7)",
}

export const comingSoonBadge = {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 3,
    px: 1,
    py: 0.25,
    border: `1px solid ${colors.gold4}`,
    borderRadius: 1,
    background: colors.overlayBackground,
    color: colors.gold2,
    fontFamily: `${typography.button.fontFamily}, sans-serif`,
    fontSize: "0.65rem",
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase",
}
