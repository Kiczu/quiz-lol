import { Close as CloseIcon } from "@mui/icons-material";
import { DialogTitle, IconButton, Typography, Box } from "@mui/material";

import { AppModalVariant } from "../../context/ModalContext/modal.types";
import { colors } from "../../theme/colors";

import { variantIconMap } from "./modal.config";
import {
  modalTitleBox,
  modalTitleTypography,
  modalTitleColor,
  modalTitleContainer,
} from "./modal.style";

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
    <DialogTitle sx={modalTitleContainer}>
      <Box sx={modalTitleBox}>
        {Icon && (
          <Icon
            sx={{ mr: 1, fontSize: "1.5rem", color: modalTitleColor(variant) }}
          />
        )}
        <Typography
          component="span"
          sx={{ ...modalTitleTypography, color: modalTitleColor(variant) }}
        >
          {title}
        </Typography>
      </Box>
      {!disableClose && onClose && (
        <IconButton onClick={onClose}>
          <CloseIcon sx={{ color: colors.error }} />
        </IconButton>
      )}
    </DialogTitle>
  );
};

export default ModalHeader;
