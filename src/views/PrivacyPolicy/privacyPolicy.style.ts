import { colors } from "../../theme/colors";
import { fill, fillColumn } from "../../theme/layout";
import { typography } from "../../theme/typography";

export const privacyWrapper = {
    ...fillColumn,
    width: "100%",
}

export const privacyOverlay = {
    ...fill,
    display: "flex",
    justifyContent: "center",
    backdropFilter: "blur(4px)",
    backgroundColor: colors.overlayBackground,
    padding: { xs: "32px 16px", md: "48px 80px" },
}

export const privacyContent = {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    maxWidth: 800,
    width: "100%",
}

export const privacyTitle = {
    fontFamily: `${typography.h1.fontFamily}, sans-serif`,
    fontSize: { xs: "1.8rem", md: "2.4rem" },
    color: colors.gold2,
    textTransform: "uppercase",
    letterSpacing: 2,
}

export const privacyHeading = {
    fontFamily: `${typography.h2.fontFamily}, sans-serif`,
    fontSize: { xs: "1.1rem", md: "1.3rem" },
    color: colors.gold2,
    mt: 2,
}

export const privacyText = {
    color: colors.textSecondary,
}
