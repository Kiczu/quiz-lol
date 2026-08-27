import { colors } from "../../theme/colors";
import { fill, fillColumn } from "../../theme/layout";
import { typography } from "../../theme/typography";

export const notFoundWrapper = {
    ...fillColumn,
    width: "100%",
}

export const notFoundOverlay = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    gap: 2,
    ...fill,
    backdropFilter: "blur(4px)",
    backgroundColor: colors.overlayBackground,
    padding: {
        xs: "20px 0",
        sm: "20px 24px",
        md: "20px 60px",
        lg: "20px 80px"
    },
}

export const notFoundCode = {
    fontFamily: `${typography.h1.fontFamily}, sans-serif`,
    fontSize: { xs: "6rem", md: "9rem" },
    fontWeight: 700,
    lineHeight: 1,
    letterSpacing: 8,
    background: colors.accentGradient,
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
}

export const notFoundTitle = {
    fontFamily: `${typography.h2.fontFamily}, sans-serif`,
    fontSize: { xs: "1.5rem", md: "2rem" },
    color: colors.gold2,
    textTransform: "uppercase",
    letterSpacing: 2,
}

export const notFoundDesc = {
    color: colors.textSecondary,
    fontSize: { xs: "1rem", md: "1.1rem" },
    maxWidth: 420,
    mb: 2,
}
