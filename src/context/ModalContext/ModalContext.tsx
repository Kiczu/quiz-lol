import { createContext, useContext, useState, ReactNode } from "react";
import AppModal from "../../components/AppModal/AppModal";
import { Button } from "@mui/material";
import { ModalContextType, ModalState } from "./modal.types";

const ModalContext = createContext<ModalContextType | undefined>(undefined);

const ModalActions = ({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) => (
  <>
    <Button onClick={onCancel}>Anuluj</Button>
    <Button onClick={onConfirm}>OK</Button>
  </>
);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalState, setModalState] = useState<ModalState>({
    open: false,
    content: null,
  });

  const showModal = (modal: Omit<ModalState, "open">) => {
    setModalState({ ...modal, open: true });
  };

  const closeModal = () => {
    setModalState({ ...modalState, open: false });
  };

  return (
    <ModalContext.Provider value={{ showModal, closeModal, modalState }}>
      {children}
      <AppModal
        open={modalState.open}
        onClose={modalState.disableClose ? closeModal : undefined}
        title={modalState.title}
        actions={
          modalState.actions ??
          (modalState.onConfirm && (
            <ModalActions
              onCancel={() => {
                modalState.onCancel?.();
                closeModal();
              }}
              onConfirm={() => {
                modalState.onConfirm?.();
                closeModal();
              }}
            />
          ))
        }
        disableClose={modalState.disableClose}
        variant={modalState.variant}
      >
        {modalState.content}
      </AppModal>
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
