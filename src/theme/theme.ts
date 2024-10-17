import { createTheme } from '@mui/material/styles';
import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

export const theme = createTheme({
    palette: {
        primary: {
            main: colors.primary,
        },
        secondary: {
            main: colors.secondary,
        },
        background: {
            default: colors.grey3,
            paper: colors.backgroundSecondary,
        },
        text: {
            primary: colors.textPrimary,
            secondary: colors.textSecondary,
        },
    },
    typography: {
        fontFamily: typography.fontFamily,
        h1: typography.h1,
        h2: typography.h2,
        body1: typography.body1,
    },
    spacing: spacing.medium,
    components: {
        MuiTextField: {
            variants: [
                {
                    props: { variant: 'outlined' },
                    style: {
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: colors.gold4,
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: colors.gold4,
                            },
                            '& .MuiInputBase-adornedEnd': {
                                backgroundColor: 'transparent',
                            },
                        },
                    },
                },
                {
                    props: { variant: 'filled' },
                    style: {
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: colors.gold4,
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: colors.gold4,
                            },
                            '& .MuiInputBase-adornedEnd': {
                                backgroundColor: colors.background,
                            },
                        },
                    },
                },
            ],
        },
        MuiButton: {
            variants: [
                {
                    props: { variant: 'contained' },
                    style: {
                        backgroundColor: colors.gold4,
                        color: colors.gold1,
                        '&:hover': {
                            backgroundColor: colors.gold3,
                        },
                    },
                },
                {
                    props: { variant: 'outlined' },
                    style: {
                        borderColor: colors.gold4,
                        color: colors.gold1,
                        '&:hover': {
                            borderColor: colors.gold3,
                        },
                    },
                },
            ],
        },
    },
});
