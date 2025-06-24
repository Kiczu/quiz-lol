import { colors } from "./colors";

export const typography = {
    fontFamily: "'Spiegel', sans-serif",
    fontSize: 14,
    h1: {
        fontSize: "2.5rem",
        fontWeight: 400,
        lineHeight: 1.2,
        color: `${colors.textPrimary}`,
    },
    h2: {
        fontSize: "2rem",
        fontWeight: 500,
        lineHeight: 1.3,
        color: `${colors.gold2}`,
    },
    h3: {
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
        fontSize: "0.875rem",
        fontWeight: 700,
        textTransform: "uppercase",
    },
};
