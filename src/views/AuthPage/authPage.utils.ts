import { randomNumberTo } from "../../utils/number";

const images = require.context("../../assets/images/login", true);
const imageList = images.keys().map((image) => images(image));

export const getRandomImage = () => {
    const savedImage = sessionStorage.getItem('backgroundImage');

    if (savedImage) {
        return savedImage;
    }

    const randomIndex = randomNumberTo(imageList.length);
    const randomImage = imageList[randomIndex];

    sessionStorage.setItem('backgroundImage', randomImage);

    return randomImage;
};