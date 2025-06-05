import { useState, ReactNode } from "react";
import { Button } from "@mui/material";
import { ModalContext } from "./ModalContext";
import { ModalContextType, ModalState } from "./modal.types";
import ModalActions from "./ModalActions";
import AppModal from "../../components/AppModal/AppModal";
import ReauthPasswordForm from "../../components/ReauthPasswordForm/ReauthPasswordForm";

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalState, setModalState] = useState<ModalState>({
    open: false,
    content: null,
  });

  const showModal: ModalContextType["showModal"] = (modal) => {
    setModalState({ ...modal, open: true });
  };

  const closeModal: ModalContextType["closeModal"] = () => {
    setModalState((prev) => ({ ...prev, open: false }));
  };

  const requestReauthentication: ModalContextType["requestReauthentication"] =
    () =>
      new Promise<string>((resolve, reject) => {
        showModal({
          variant: "confirm",
          title: "Reauthentication required",
          content: (
            <ReauthPasswordForm
              onSubmit={async (password) => {
                closeModal();
                resolve(password);
              }}
              onCancel={() => {
                closeModal();
                reject(new Error("User cancelled reauthentication"));
              }}
            />
          ),
          disableClose: true,
        });
      });

  const defaultActions = (
    <Button onClick={closeModal} variant="contained" autoFocus>
      Got it
    </Button>
  );

  return (
    <ModalContext.Provider
      value={{ showModal, closeModal, modalState, requestReauthentication }}
    >
      {children}
      <AppModal
        open={modalState.open}
        onClose={modalState.disableClose ? undefined : closeModal}
        title={modalState.title}
        actions={
          modalState.actions ??
          (modalState.variant !== "confirm" ? defaultActions : undefined) ??
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

export default ModalProvider;
