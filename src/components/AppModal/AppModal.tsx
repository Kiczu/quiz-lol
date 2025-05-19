import { Dialog, DialogContent, DialogActions } from "@mui/material";
import { forwardRef, ReactNode } from "react";
import { motion } from "framer-motion";
import { AppModalVariant } from "../../context/ModalContext/modal.types";
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
      PaperProps={{ sx: { borderRadius: 2, p: 2, minWidth: 400 } }}
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
      >
        {children}
      </MotionDialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};

export default AppModal;
