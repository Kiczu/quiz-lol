import { colors } from "../../theme/colors"

export const navigationContainer = {
    backgroundColor: colors.background,
    border: 0,
    borderBottom: "3px solid",
    borderImage: "linear-gradient(90deg, #C8AA6E 60%, #0AC8B9 100%) 1",
    boxShadow: "0 4px 16px 0 #C8AA6E22",
    zIndex: 1201,
}

export const userMenuContainer = {
    mt: 6,
    "& .MuiList-root": {
        paddingTop: 0,
        paddingBottom: 0,
    },
    "& .MuiPaper-root": {
        border: "none",
        boxShadow: "0 4px 32px 2px #0AC8B9",
    }
}

export const userMenuItemSx = {
    fontWeight: 700,
    letterSpacing: 2,
    fontSize: 4,
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
