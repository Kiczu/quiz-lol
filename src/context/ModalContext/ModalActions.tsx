import { Button, Box } from "@mui/material";

interface ModalActionsProps {
  onCancel?: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  onlyConfirm?: boolean;
}

const ModalActions = ({
  onCancel,
  onConfirm,
  confirmLabel = "Got it",
  cancelLabel = "Cancel",
  onlyConfirm = true,
}: ModalActionsProps) => (
  <Box display="flex" gap={2} justifyContent="flex-end">
    {!onlyConfirm && onCancel && (
      <Button onClick={onCancel} variant="outlined">
        {cancelLabel}
      </Button>
    )}
    <Button onClick={onConfirm} variant="contained" autoFocus>
      {confirmLabel}
    </Button>
  </Box>
);

export default ModalActions;
