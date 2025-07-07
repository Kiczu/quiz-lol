import { colors } from "../../theme/colors";

export const championCard = {
    position: "relative",
    background: "rgba(28,34,48, 0.92)",
    borderRadius: "0px",
    boxShadow: "0 4px 24px 2px #C8AA6E22, 0 1px 8px #0008",
    overflow: "hidden",
    border: "none",
    transition: "transform 0.2s cubic-bezier(.34,1.56,.64,1)",
    "&:hover": {
        boxShadow: "0 8px 32px 4px #C8AA6E55, 0 4px 24px #0397AB88",
        background: "rgba(28,34,48, 0.97)",
        transform: "translateY(-6px) scale(1.035)",
    },
};

export const championImage = {
    width: "100%",
    display: "block",
    borderRadius: 0,
    filter: "brightness(0.98) contrast(1.08)",
};

export const championNameBanner = {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    fontFamily: "'BeaufortforLOL', sans-serif",
    fontWeight: 700,
    fontSize: "1.1rem",
    letterSpacing: 2,
    color: colors.gold1,
    textAlign: "center",
    p: "12px 0",
    background: "linear-gradient(90deg, #C8AA6E 50%, #0AC8B9 100%)",
    boxShadow: "0 -2px 8px 0 #0AC8B966",
    borderRadius: 0,
    zIndex: 9,
};
