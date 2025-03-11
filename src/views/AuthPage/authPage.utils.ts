import { randomNumberTo } from "../../utils/number";

declare const require: {
    context: (directory: string, useSubdirectories?: boolean, regExp?: RegExp) => {
        keys: () => string[];
        (path: string): string;
    };
};

const imagesContext = require.context("../../assets/images/login", true);
const images = imagesContext.keys().map(imagesContext);

export const getRandomImage = () => {
    const savedImage = sessionStorage.getItem('backgroundImage');

    if (savedImage) {
        return savedImage;
    }

    const randomIndex = randomNumberTo(images.length);
    const randomImage = images[randomIndex];

    sessionStorage.setItem('backgroundImage', randomImage);

    return randomImage;
};