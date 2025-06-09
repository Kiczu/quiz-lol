import { DialogTitle, IconButton, Typography, Box } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { AppModalVariant } from "../../context/ModalContext/modal.types";
import { variantColorMap, variantIconMap } from "./modal.config";

interface Props {
  title?: string;
  variant: AppModalVariant;
  disableClose?: boolean;
  onClose?: () => void;
}

const ModalHeader = ({ title, variant, disableClose, onClose }: Props) => {
  const Icon = variantIconMap[variant];

  if (!title && !Icon) return null;

  return (
    <DialogTitle
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {Icon && <Icon sx={{ color: variantColorMap[variant] }} />}
        <Typography variant="h6">{title}</Typography>
      </Box>
      {!disableClose && onClose && (
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      )}
    </DialogTitle>
  );
};

export default ModalHeader;
