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

export const afterSX = {
    content: '""',
    position: "absolute",
    top: "-6px",
    left: "-6px",
    width: "calc(100% + 12px)",
    height: "calc(100% + 12px)",
    borderRadius: "50%",
    filter: "blur(5px)",
    opacity: 0.6,
    zIndex: 0,
    transition: "opacity .18s, filter .18s",
};

export const hoverSX = {
    filter: "brightness(1.12)",
    transform: "scale(1.045)",
    zIndex: 3,
    "&::after": {
        opacity: 0.82,
        filter: "blur(7px)",
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