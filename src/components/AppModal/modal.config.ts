import {
    CheckCircle as SuccessIcon,
    Info as InfoIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
    Help as ConfirmIcon,
} from "@mui/icons-material";

export const variantIconMap = {
    info: InfoIcon,
    success: SuccessIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    confirm: ConfirmIcon,
    default: null,
};

export const variantColorMap = {
    info: "info.main",
    success: "success.main",
    warning: "warning.main",
    error: "error.main",
    confirm: "primary.main",
    default: "text.primary",
};