import { randomNumberTo } from "../../utils/number";

const images = Object.values(
    import.meta.glob<string>("../../assets/images/login/*", {
        eager: true,
        query: "?url",
        import: "default",
    })
);

export const getRandomImage = () => {
    const savedImage = sessionStorage.getItem("backgroundImage");

    if (savedImage && images.includes(savedImage)) {
        return savedImage;
    }

    const randomImage = images[randomNumberTo(images.length)];
    sessionStorage.setItem("backgroundImage", randomImage);

    return randomImage;
};
