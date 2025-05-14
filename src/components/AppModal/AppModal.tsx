import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ReactNode } from "react";

interface AppModalProps {
  open: boolean;
  onClose?: () => void;
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
  disableClose?: boolean;
}

const AppModal = ({
  open,
  onClose,
  title,
  children,
  actions,
  disableClose = false,
}: AppModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={disableClose ? undefined : onClose}
      disableEscapeKeyDown={disableClose}
      hideBackdrop={false}
      PaperProps={{ sx: { borderRadius: 2, p: 2, minWidth: 400 } }}
    >
      {title && (
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          {title}
          {!disableClose && onClose && (
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
      )}
      <DialogContent>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};

export default AppModal;
