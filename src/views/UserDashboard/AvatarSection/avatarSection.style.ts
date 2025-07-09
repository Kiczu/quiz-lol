import zIndex from "@mui/material/styles/zIndex";
import { colors } from "../../../theme/colors";

export const avatarGridContainer = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    mb: 4,
    "@media (max-width: 900px)": {
        flexDirection: "column",
        alignItems: "center",
    },
};

// Wrapper dla dużego avatara
export const bigAvatarWrapper = {
    width: 200,
    height: 200,
    padding: "6px",
    borderRadius: "50%",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    mb: 2,
    "@media (max-width: 900px)": {
        width: 120,
        height: 120,
        padding: "3.5px",
        mb: 3,
    },
};

export const bigAvatarImg = {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    objectFit: "cover",
    background: colors.gold3,
    color: colors.textPrimary,
};

export const smallAvatarsGrid = {
    maxWidth: "70%",
    "@media (max-width: 900px)": {
        maxWidth: "100%",
    },
};

export const smallAvatarItem = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
};

export const smallAvatarWrapper = {
    width: 80,
    height: 80,
    padding: "3px",
    borderRadius: "50%",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    overflow: "visible",
    "@media (max-width: 600px)": {
        width: 70,
        height: 70,
        padding: "1.5px",
    },
};

export const smallAvatarImg = {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    objectFit: "cover",
    zIndex: 1,
};

export const deleteAvatarImg = {
    color: "white",
    cursor: "pointer",
};