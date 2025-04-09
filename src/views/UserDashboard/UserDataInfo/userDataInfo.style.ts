import { colors } from "../../../theme/colors";

export const userDataInfoBox = {
    display: "flex",
    flexDirection: "column",
    gap: 1,
    justifyContent: "center",
    padding: 2,
    borderRadius: "10px",
    backgroundColor: colors.backgroundSecondary,
    border: `1px solid ${colors.gold4}`,
    "@media (max-width: 900px)": {
        alignItems: "center",
    },
}