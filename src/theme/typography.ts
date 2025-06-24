import { colors } from "./colors";

export const typography = {
    fontFamily: "'Spiegel', sans-serif",
    h1: {
        fontFamily: "'BeaufortforLOL', sans-serif",
        fontSize: "2.5rem",
        fontWeight: 400,
        lineHeight: 1.2,
        color: `${colors.textPrimary}`,
    },
    h2: {
        fontFamily: "'BeaufortforLOL', sans-serif",
        fontSize: "2rem",
        fontWeight: 500,
        lineHeight: 1.3,
        color: `${colors.gold2}`,
    },
    h3: {
        fontFamily: "'BeaufortforLOL', sans-serif",
        fontSize: "1.5rem",
        fontWeight: 500,
        lineHeight: 1.35,
        color: `${colors.textPrimary}`,
    },
    body1: {
        fontSize: "1rem",
        fontWeight: 400,
        lineHeight: 1.5,
        color: `${colors.gold1}`,
    },
    body2: {
        fontSize: "0.875rem",
        fontWeight: 400,
        lineHeight: 1.43,
        color: `${colors.gold2}`,
    },
    button: {
        fontFamily: "'BeaufortforLOL', sans-serif",
        fontSize: "0.875rem",
        fontWeight: 700,
        textTransform: "uppercase",
    },
};
