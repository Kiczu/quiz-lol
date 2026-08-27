import { createTheme } from '@mui/material/styles';

import { colors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

export const theme = createTheme({
    palette: {
        primary: { main: colors.primary },
        secondary: { main: colors.secondary },
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
        h1: { ...typography.h1 },
        h2: { ...typography.h2 },
        h3: { ...typography.h3 },
        h4: { ...typography.h4 },
        h5: { ...typography.h5 },
        h6: { ...typography.h6 },
        body1: { ...typography.body1 },
        body2: { ...typography.body2 },
        button: {
            ...typography.button,
            textTransform: "uppercase" as const,
        },
    },
    spacing: spacing.medium,
    shape: {
        borderRadius: 0,
    },
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    background: "rgba(24,28,42,0.92)",
                    color: colors.textPrimary,
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: colors.gold2,
                        borderRadius: 0,
                        borderWidth: 2,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: colors.blue2,
                        borderWidth: 2.5,
                    },
                },
                input: {
                    color: colors.textPrimary,
                },
            },
        },
        MuiTextField: {
            variants: [
                {
                    props: { variant: 'outlined', disabled: true },
                    style: {
                        '& .MuiOutlinedInput-root': {
                            '&.Mui-disabled fieldset': {
                                borderColor: colors.gold5,
                                borderRadius: 0,
                            },
                            '& .MuiInputBase-input.Mui-disabled': {
                                WebkitTextFillColor: colors.textSecondary,
                                cursor: 'not-allowed',
                            },
                        },
                        '& .MuiInputLabel-root.Mui-disabled': {
                            color: colors.textSecondary,
                        },
                        '& .MuiFormHelperText-root': {
                            color: colors.warning,
                            padding: '8px',
                            margin: 0,
                            backgroundColor: colors.gold5,
                        },
                    },
                },
            ],
        },
        MuiButton: {
            variants: [
                {
                    props: { color: "error", variant: "contained" },
                    style: {
                        backgroundColor: `${colors.error2}`,
                        color: "#fff",
                        borderRadius: 0,
                        fontWeight: 700,
                        letterSpacing: 2,
                        textTransform: "uppercase",
                        "&:hover": {
                            backgroundColor: `${colors.error}`,
                        },
                    },
                },
                {
                    props: { color: "error", variant: "outlined" },
                    style: {
                        color: colors.error,
                        border: `2px solid ${colors.error}`,
                        borderRadius: 0,
                        fontWeight: 700,
                        letterSpacing: 2,
                        textTransform: "uppercase",
                        "&:hover": {
                            backgroundColor: "rgba(255, 87, 51, 0.1)",
                        },
                    },
                },
            ],
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    fontWeight: 700,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                },
                contained: {
                    backgroundColor: colors.gold4,
                    color: colors.gold1,
                    '&:hover': {
                        backgroundColor: colors.gold3,
                    },
                },
                outlined: {
                    borderColor: colors.gold4,
                    color: colors.gold1,
                    '&:hover': {
                        borderColor: colors.gold3,
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    background: "rgba(28,34,48, 0.94)",
                    border: `2px solid ${colors.gold2}`,
                    borderRadius: 0,
                    boxShadow: `0 4px 32px 2px ${colors.gold2}33`,
                    backdropFilter: "blur(6px)",
                },
            },
        },
    },
});
