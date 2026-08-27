import { colors } from "../../theme/colors"

export const navigationContainer = {
    backgroundColor: colors.background,
    border: 0,
    borderBottom: "3px solid",
    borderImage: `${colors.accentGradient} 1`,
    zIndex: 10,
}

export const menuItem = {
    fontWeight: 700,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "inherit",
    textDecoration: "none",
    margin: 0,
    padding: 1,
    transition: "all 0.2s ease-in-out",
    "&:hover": {
        backgroundColor: `${colors.gold2}`,
    },
}

export const logoNav = {
    maxWidth: 80,
    width: "100%",
    display: { xs: "flex", md: "none" },
    flexGrow: 1,
    margin: "auto",
}

export const userSettingsContainer = {
    mt: { xs: 6, md: 9 },
    "& .MuiList-root": {
        paddingTop: 0,
        paddingBottom: 0,
    },
    "& .MuiPaper-root": {
        border: "none",
        boxShadow: `0 4px 32px 2px ${colors.gradientBlue}`,
    }
}

export const mobileNavPagesContainer = {
    display: { xs: "block", md: "none" },
    "& .MuiList-root": {
        paddingTop: 0,
        paddingBottom: 0,
    },
    "& .MuiPaper-root": {
        border: "none",
        boxShadow: `0 4px 32px 2px ${colors.gold2}`,
    }
}

export const desktopNavPagesContainer = {
    flexGrow: 1,
    gap: 2,
    justifyContent: "center",
    alignItems: "center",
    display: { xs: "none", md: "flex" },
}


export const desktopNavPages = {
    position: "relative",
    color: colors.gold1,
    background: "none",
    border: "none",
    borderRadius: 0,
    fontWeight: 700,
    fontSize: "1.08rem",
    px: 3,
    py: 1,
    overflow: "hidden",
    letterSpacing: "0.08em",
    minWidth: 90,
    transition: "color 0.18s cubic-bezier(.34,1.56,.64,1)",
    "&::before": {
        content: '""',
        position: "absolute",
        inset: 0,
        border: `2px solid ${colors.gold2}`,
        borderRadius: 0,
        boxSizing: "border-box",
        pointerEvents: "none",
        zIndex: 1,
        clipPath: "polygon(0 100%, 0 100%, 0 100%, 0 100%)",
        transition: "clip-path 0.5s cubic-bezier(.34,1.56,.64,1), border-color .2s",
    },
    "&:hover, &:focus": {
        color: colors.blue1,
        background: "rgba(12,60,140,0.06)",
        "&::before": {
            borderColor: colors.blue1,
            clipPath: "polygon(0 100%, 0 0, 100% 0, 100% 100%)",
            transitionDelay: "0s",
        },
    },
};

export const avatarIcon = {
    width: { xs: "40px", md: "55px" },
    height: { xs: "40px", md: "55px" },
    ml: 2,
}
