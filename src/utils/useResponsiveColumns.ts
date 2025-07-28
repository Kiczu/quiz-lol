import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export const useResponsiveColumns = (
    breakpoints: { xs: number; sm?: number; md?: number; lg?: number; xl?: number } = { xs: 1, sm: 2, md: 3, lg: 4, xl: 6 }
) => {
    const theme = useTheme();

    const isXlUp = useMediaQuery(theme.breakpoints.up("xl"));
    const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
    const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

    if (isXlUp && breakpoints.xl !== undefined) return breakpoints.xl;
    if (isLgUp && breakpoints.lg !== undefined) return breakpoints.lg;
    if (isMdUp && breakpoints.md !== undefined) return breakpoints.md;
    if (isSmUp && breakpoints.sm !== undefined) return breakpoints.sm;
    return breakpoints.xs;
};
