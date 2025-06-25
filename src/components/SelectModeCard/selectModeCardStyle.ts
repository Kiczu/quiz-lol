import { colors } from "../../theme/colors";

export const linkCardContainer = {
    display: "block",
    height: "100%",
    transition: "transform 0.18s cubic-bezier(.34,1.56,.64,1)",
    "&:hover": { transform: "translateY(-6px) scale(1.035)" },
}

export const modeCard = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 2,
    border: `2px solid ${colors.gold2}`,
    background: "rgba(10, 16, 28, 0.82)",
    boxShadow: "0 4px 32px 2px rgba(20,20,30,0.14)",
    padding: { xs: "22px 8px", sm: "32px 16px" },
    minHeight: { xs: 180, sm: 220 },
    overflow: "hidden",
    backdropFilter: "blur(8px)",
    position: "relative",
    transition: "border 0.22s, box-shadow 0.18s",
    "&:hover": {
        border: `2px solid ${colors.gold3}`,
        boxShadow: "0 8px 46px 6px #C8AA6E44, 0 1px 8px #0004",
        background: "rgba(10, 16, 28, 0.94)",
    },
}

export const modeImg = {
    width: { xs: 52, sm: 70 },
    height: { xs: 52, sm: 70 },
    borderRadius: "50%",
    boxShadow: "0 0 0 2px #C8AA6E99",
    objectFit: "cover",
    mb: 2,
    transition: "box-shadow 0.2s",
}

export const modeTitle = {
    fontFamily: "'BeaufortforLOL', sans-serif",
    fontSize: { xs: "1.15rem", sm: "1.25rem", md: "1.45rem" },
    fontWeight: 700,
    color: colors.gold2,
    letterSpacing: 2,
    textTransform: "uppercase",
    textAlign: "center",
    mb: 1,
    lineHeight: 1.16,
}

export const modeDesc = {
    color: colors.textSecondary,
    fontSize: { xs: "0.95rem", sm: "1.05rem" },
    textAlign: "center",
    fontFamily: "'Spiegel', Arial, sans-serif",
    maxWidth: "240px",
}