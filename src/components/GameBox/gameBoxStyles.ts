import startGame from "../../assets/images/startGame.jpg";

export const startGameContainer = {
    position: "relative",
    backgroundImage: `url(${startGame})`,
    backgroundPosition: "50% 20%",
    backgroundSize: "cover",
    minHeight: "90vh",
}

export const endGameContainer = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    minHeight: "90vh",
    background: "#010A13",
    color: "#F0E6D2",
}

export const deafetGame = {
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
    minHeight: "90vh",
    background: "rgba(8, 10, 18, 0.8)"
}
