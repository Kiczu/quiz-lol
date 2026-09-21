import { colors } from "../../theme/colors";
import { fillColumn } from "../../theme/layout";

export const pvpWrapper = {
    ...fillColumn,
    position: "relative",
    backgroundColor: colors.overlayBackground,
    backdropFilter: "blur(4px)",
    py: { xs: 3, md: 5 },
};

export const pvpContent = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
    textAlign: "center",
};

export const lobbyPanel = {
    alignSelf: "center",
    width: "100%",
    maxWidth: 560,
    p: { xs: 2, sm: 4 },
    border: `1px solid ${colors.gold4}`,
    backgroundColor: colors.backgroundSecondary,
    display: "flex",
    flexDirection: "column",
    gap: 3,
};

export const playerPanel = {
    flex: 1,
    minWidth: 0,
    p: 2,
    border: `1px solid ${colors.gold4}`,
    backgroundColor: colors.backgroundSecondary,
    overflowWrap: "anywhere",
};

export const roomCode = {
    color: colors.gold2,
    letterSpacing: 6,
    fontSize: { xs: "2rem", sm: "3rem" },
    fontWeight: 700,
};
