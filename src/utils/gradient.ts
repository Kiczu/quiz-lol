export const getMultiColumnGradientSx = (
    columns: number,
    idx: number,
    gradient: string
) => ({
    background: gradient,
    backgroundSize: `${columns * 100}% 100%`,
    backgroundPositionX: `${(100 / columns) * (idx % columns)}%`,
    backgroundRepeat: "no-repeat",
});