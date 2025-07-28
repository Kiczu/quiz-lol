import { colors } from "../../../theme/colors";
import { getMultiColumnGradientSx } from "../../../utils/gradient";

export const regionBoxSx = {
    minHeight: 135,
    position: "relative",
    background: colors.backgroundSecondary,
};

export const getRegionCardWrapperSx = (columns: number, idx: number, border: number) => ({
    ...getMultiColumnGradientSx(columns, idx, colors.accentGradient),
    p: `${border}px`,
    display: "block",
    position: "relative",
    cursor: "pointer",
    transition: "transform .2s, box-shadow .2s",
    "&:hover": {
        transform: "translateY(-15px)",
        boxShadow: `0 0 48px 8px ${colors.gold2}33`,
        zIndex: 2,
    },
    "&:active": {
        transform: "scale(0.97)",
    },
});

export const regionBackgroundSx = (background: string) => ({
    position: "absolute",
    width: "100%",
    height: "75%",
    top: 0,
    left: 0,
    background: `url(${background}) center/cover no-repeat`,
    opacity: 0.83,
    filter: "brightness(0.43) blur(0.7px)",
    transition: "opacity .13s, filter .13s",
    zIndex: 1,
});

export const regionCrestSx = {
    width: 38,
    height: 38,
    position: "absolute",
    left: "50%",
    top: 38,
    transform: "translateX(-50%)",
    filter: "drop-shadow(0 0 10px #000B)",
    transition: "opacity .13s",
    zIndex: 2,
};

export const regionNameWrapperSx = {
    position: "absolute",
    bottom: 0,
    width: "100%",
    background: "rgba(14, 18, 30, 0.94)",
    color: colors.gold1,
    fontWeight: 900,
    fontSize: "1rem",
    letterSpacing: 1.5,
    p: "10px 0 5px 0",
    textAlign: "center",
    zIndex: 3,
};

export const regionNameTypographySx = {
    fontWeight: 900,
    letterSpacing: 2,
};
