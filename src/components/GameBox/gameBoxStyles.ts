import startGame from "../../assets/images/startGame.jpg";
import { colors } from "../../theme/colors";
import { fill, fillColumn } from "../../theme/layout";

export const startGameContainer = {
    position: "relative",
    backgroundImage: `url(${startGame})`,
    backgroundPosition: "50% 20%",
    backgroundSize: "cover",
    ...fillColumn,
}

export const endGameContainer = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    ...fill,
    background: colors.background,
    color: colors.textPrimary,
}

export const defeatGame = {
    maxWidth: "350px",
}

export const victoryGame = {
    maxWidth: "550px",
}

export const overlayGameBox = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    ...fill,
    background: "rgba(8, 10, 18, 0.8)"
}
