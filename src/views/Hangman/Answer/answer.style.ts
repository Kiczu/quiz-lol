import { colors } from "../../../theme/colors";

export const answerWrapper = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "100%",
    gap: { xs: 1, sm: 2 },
    mt: { xs: 2, sm: 4, md: 6 },
    mb: { xs: 2, sm: 4, md: 6 },
    px: 2,
    py: 1,
    border: `2px solid ${colors.gold3}`,
    borderRadius: "16px",
    background: `linear-gradient(90deg, ${colors.gold2}33 0%, ${colors.gold5}33 100%)`,
    boxShadow: `0 0 12px 2px ${colors.gold2}55`,
};

export const answerLetter = (isCorrect: boolean) => ({
    color: isCorrect ? colors.gold2 : colors.textSecondary,
    minWidth: { xs: 15, sm: 20, md: 26 },
    fontWeight: 700,
    borderBottom: isCorrect ? `2px solid ${colors.gold3}` : `2px solid ${colors.grey2}`,
    fontSize: { xs: "1.05rem", sm: "1.4rem", md: "2.2rem" },
    textShadow: isCorrect
        ? `0 0 10px ${colors.gold3}, 0 0 5px ${colors.gold2}`
        : "none",
    margin: { xs: "0 2px", sm: "0 4px", md: "0 7px" },
    transition: "all .2s",
});
