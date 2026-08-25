import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

export const notFoundContainer = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    gap: 2,
    minHeight: "80vh",
    px: 2,
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

export const notFoundButton = {
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
