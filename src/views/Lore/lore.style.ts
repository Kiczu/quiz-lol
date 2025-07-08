import { colors } from "../../theme/colors";
import { getMultiColumnGradientSx } from "../../utils/gradient";

export const loreViewWrapper = {
    minHeight: "100vh",
    width: "100%",
}

export const loreViewOverlay = {
    minHeight: "100vh",
    backdropFilter: "blur(4px)",
    backgroundColor: "rgba(10, 20, 40 ,0.6)",
    padding: {
        xs: "20px 0",
        sm: "20px 24px",
        md: "20px 60px",
        lg: "20px 80px"
    },
}

export const loreViewHeader = {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    textAlign: "center",
    m: 4,
}

export const championCard = {
    position: "relative",
    background: "rgba(28,34,48, 0.92)",
    borderRadius: "0px",
    boxShadow: "0 4px 24px 2px #C8AA6E22, 0 1px 8px #0008",
    overflow: "hidden",
    border: "none",
    transition: "transform 0.5s cubic-bezier(.34,1.56,.64,1)",
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
    boxShadow: "0 -2px 8px 0 #0AC8B966",
    borderRadius: 0,
    zIndex: 9,
};

export const getBannerSx = (columns: number, idx: number) => ({
    ...championNameBanner,
    ...getMultiColumnGradientSx(columns, idx, colors.accentGradient),
});