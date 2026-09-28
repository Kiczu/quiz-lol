import { randomNumberTo } from "../../utils/number";

const SPLASH_URL = "https://ddragon.leagueoflegends.com/cdn/img/champion/splash";

const champions = [
    "Aurora",
    "Hwei",
    "Malphite",
    "MasterYi",
    "Singed",
    "Teemo",
    "Udyr",
    "Zed",
];

const images = champions.map((champion) => `${SPLASH_URL}/${champion}_0.jpg`);

export const getRandomImage = () => {
    const savedImage = sessionStorage.getItem("backgroundImage");

    if (savedImage && images.includes(savedImage)) {
        return savedImage;
    }

    const randomImage = images[randomNumberTo(images.length)];
    sessionStorage.setItem("backgroundImage", randomImage);

    return randomImage;
};
