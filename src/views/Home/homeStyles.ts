import heroImage from "../../assets/images/hero.jpg";

export const homeHeroContainer = {
    position: "relative",
    backgroundImage: `url(${heroImage})`,
    backgroundPosition: "top center",
    backgroundSize: "cover",
    height: "100vh",
}

export const heroOverlay = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    background: "linear-gradient(180deg, rgba(0,0,0,0), black);",
}
export const headline = {
    color: "primary.main",
    textShadow: "0 2px 16px #000",
    mb: 2,
    fontWeight: 700,
    textAlign: "center",
    fontSize: { xs: "2.2rem", sm: "3rem", md: "3.5rem" },
    lineHeight: 1.1,
    letterSpacing: 1,
}

export const subtitle = {
    color: "gold2.main",
    textShadow: "0 1px 8px #000",
    mb: 5,
    fontWeight: 400,
    textAlign: "center",
    fontSize: { xs: "1.2rem", sm: "1.6rem", md: "2rem" },
}

export const modesContainer = {
    width: "80%",
    display: "grid",
    gap: 10,
    gridTemplateColumns: {
        xs: "1fr",
        sm: "1fr 1fr",
        md: "repeat(4, 1fr)",
    },
    background: "transparent",
    mt: 5,
    alignItems: "stretch",
}
