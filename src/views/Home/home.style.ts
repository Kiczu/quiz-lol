import heroImage from "../../assets/images/hero.webp";
import { fill, fillColumn } from "../../theme/layout";

export const homeColumns = { xs: 1, sm: 2, lg: 4 };

export const homeHeroContainer = {
    position: "relative",
    backgroundImage: `url(${heroImage})`,
    backgroundPosition: "top center",
    backgroundSize: "cover",
    ...fillColumn,
}

export const heroOverlay = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    boxSizing: "border-box",
    px: { xs: 2, sm: 3, lg: 4 },
    py: { xs: 4, sm: 5, lg: 6 },
    ...fill,
    background: "linear-gradient(180deg, rgba(0,0,0,0), black)",
}
export const headline = {
    color: "primary.main",
    textShadow: "0 2px 16px #000",
    m: 0,
    fontWeight: 700,
    textAlign: "center",
    fontSize: { xs: "2rem", sm: "2.5rem", lg: "3rem" },
    lineHeight: 1.1,
    letterSpacing: 1,
    overflowWrap: "anywhere",
}

export const subtitle = {
    color: "gold2.main",
    textShadow: "0 1px 8px #000",
    m: 0,
    fontWeight: 400,
    textAlign: "center",
    fontSize: { xs: "1.15rem", sm: "1.4rem", lg: "1.8rem" },
}

export const modesContainer = {
    width: "100%",
    maxWidth: 1280,
    display: "grid",
    gap: { xs: 2, sm: 3, xl: 4 },
    gridTemplateColumns: Object.fromEntries(Object.entries(homeColumns).map(([breakpoint, columns]) =>
        [breakpoint, `repeat(${columns}, minmax(0, 1fr))`])),
    gridAutoRows: "1fr",
    background: "transparent",
    mt: { xs: 3, sm: 4 },
    alignItems: "stretch",
}
