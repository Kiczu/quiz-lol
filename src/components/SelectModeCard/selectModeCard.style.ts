import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { getMultiColumnGradientSx } from "../../utils/gradient";

export const linkCardContainer = {
    display: "block",
    height: "100%",
    transition: "transform 0.18s cubic-bezier(.34,1.56,.64,1)",
    "&:hover": {
        transform: "translateY(-6px) scale(1.035)",
        boxShadow: "0 8px 46px 6px #C8AA6E44, 0 1px 8px #0004",
    },
}

export const modeCard = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 2,
    background: `${colors.background}`,
    boxShadow: "0 4px 32px 2px rgba(20,20,30,0.14)",
    padding: { xs: "22px 8px", sm: "32px 16px" },
    minHeight: { xs: 180, sm: 220 },
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
    display: "block",
    position: "relative",
});

export const modeImg = {
    width: { xs: 60, sm: 70, md: 80, lg: 90 },
    height: { xs: 60, sm: 70, md: 80, lg: 90 },
    borderRadius: "50%",
    boxShadow: "0 0 0 2px #C8AA6E99",
    objectFit: "cover",
    mb: 2,
    transition: "box-shadow 0.2s",
    zIndex: 2,
}

export const modeTitle = {
    fontFamily: `${typography.h3.fontFamily}, sans-serif`,
    fontSize: { xs: "1.15rem", sm: "1.25rem", md: "1.45rem" },
    fontWeight: 700,
    color: colors.gold2,
    letterSpacing: 2,
    textTransform: "uppercase",
    textAlign: "center",
    mb: 1,
    lineHeight: 1.16,
    zIndex: 2,
}

export const modeDesc = {
    color: colors.textSecondary,
    fontSize: { xs: "0.95rem", sm: "1.05rem" },
    textAlign: "center",
    fontFamily: `${typography.fontFamily}, sans-serif`,
    maxWidth: "240px",
    zIndex: 2,
}
export const disabledCardContainer = {
    display: "block",
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
