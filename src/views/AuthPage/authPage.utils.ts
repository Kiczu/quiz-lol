import { randomNumberTo } from "../../utils/number";

const images = Object.values(
    import.meta.glob<string>("../../assets/images/login/*", {
        eager: true,
        query: "?url",
        import: "default",
    })
);

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
