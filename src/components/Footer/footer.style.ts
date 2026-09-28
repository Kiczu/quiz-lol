import { colors } from "../../theme/colors";

export const footerContainer = {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 0.5,
    padding: { xs: "12px 16px", md: "14px 80px" },
    backgroundColor: colors.background,
    borderTop: "3px solid",
    borderImage: `${colors.accentGradient} 1`,
    textAlign: "center",
}

export const footerDisclaimer = {
    color: colors.textSecondary,
    fontSize: "0.75rem",
    lineHeight: 1.4,
    maxWidth: 720,
}

export const footerLink = {
    color: colors.gold2,
    fontSize: "0.8rem",
    textDecoration: "underline",
    whiteSpace: "nowrap",
}
