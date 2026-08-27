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

export const centeredMessage = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
}

export const loader = {
    color: colors.gold2,
}
