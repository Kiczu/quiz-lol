import { colors } from "../../theme/colors";
import { fill, fillColumn } from "../../theme/layout";

export const backgroundWrapper = {
    ...fillColumn,
    width: "100%",
    position: "relative",
};

export const overlay = {
    ...fill,
    backdropFilter: "blur(4px)",
    backgroundColor: colors.overlayBackground,
    padding: {
        xs: "20px 0",
        sm: "20px 24px",
        md: "20px 60px",
        lg: "20px 80px"
    },
};

export const championImage = {
    width: "100%",
    boxShadow: `0 0 30px ${colors.gold2}`,
    borderRadius: 6,
    maxWidth: "100%",
    margin: "0 auto",
};

export const title = {
    p: { xs: "20px 0", sm: "30px 0" },
    textAlign: "center",
};

export const spellName = {
    fontWeight: "bold",
    color: colors.gold2,
    fontSize: { xs: "1.1rem", sm: "1.3rem" },
    wordBreak: "break-word",
};

export const backToLoreButton = {
    mt: 3,
    fontWeight: 700,
    letterSpacing: 1,
    background: colors.gold2,
    color: colors.background,
    boxShadow: `0 0 16px 2px ${colors.gold3}80`,
    border: `2px solid ${colors.gold3}`,
    borderRadius: "12px",
    px: 4,
    py: 1.5,
    fontSize: { xs: "1rem", sm: "1.15rem" },
    textTransform: "uppercase",
    "&:hover": {
        background: colors.gold3,
        color: colors.gold1,
        borderColor: colors.gold2,
        boxShadow: `0 0 32px 4px ${colors.gold3}`,
    },
}