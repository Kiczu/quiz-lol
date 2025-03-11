import { getRandomImage } from "./authPage.utils";

export const authPageStyles = {
    container: {
        minHeight: "90vh",
        backgroundImage: `url(${getRandomImage()})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
    },
    authBox: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
        backgroundColor: "rgba(10, 20, 40 ,0.6)",
        p: 8,
    },
};

export const animationConfig = {
    initial: "hidden",
    animate: "visible",
    exit: "exit",
    variants: {
        hidden: { opacity: 0, x: -100 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 100 },
    },
    transition: { duration: 0.5 },
};
