import { Dialog, DialogContent, DialogActions } from "@mui/material";
import { motion } from "framer-motion";
import { forwardRef, ReactNode } from "react";

import { AppModalVariant } from "../../context/ModalContext/modal.types";

import { modalContent, modalDialogPaper } from "./modal.style";
import ModalHeader from "./ModalHeader";

interface AppModalProps {
  open: boolean;
  onClose?: () => void;
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
  disableClose?: boolean;
  variant?: AppModalVariant;
}

const MotionDialogContent = motion.create(
  forwardRef<HTMLDivElement, React.ComponentProps<typeof DialogContent>>(
    (props, ref) => <DialogContent ref={ref} {...props} />
  )
);

const AppModal = ({
  open,
  onClose,
  title,
  children,
  actions,
  disableClose = false,
  variant = "default",
}: AppModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={disableClose ? undefined : onClose}
      disableEscapeKeyDown={disableClose}
      hideBackdrop={false}
      slotProps={{
        backdrop: {
          sx: {
            background: `linear-gradient(90deg, rgba(200,155,60,0.16) 0%, rgba(0,90,130,0.13) 100%), rgba(10,20,40,0.45)`,
            filter: "blur(4px)",
          },
        },
      }}
      PaperProps={{ sx: modalDialogPaper }}
    >
      <ModalHeader
        title={title}
        variant={variant}
        onClose={onClose}
        disableClose={disableClose}
      />
      <MotionDialogContent
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.25 }}
        sx={modalContent}
      >
        {children}
      </MotionDialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};

export default AppModal;
