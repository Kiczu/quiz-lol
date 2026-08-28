import { randomNumberTo } from "./number";

export const shuffle = <T>(items: T[]) => {
    const result = [...items];

    for (let i = result.length - 1; i > 0; i -= 1) {
        const j = randomNumberTo(i + 1);
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
};
