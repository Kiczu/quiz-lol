import { Button } from "@mui/material";
import { useCallback, useState, ReactNode } from "react";

import AppModal from "../../components/AppModal/AppModal";
import ReauthPasswordForm from "../../components/ReauthPasswordForm/ReauthPasswordForm";

import { ModalContextType, ModalState } from "./modal.types";
import ModalActions from "./ModalActions";
import { ModalContext } from "./ModalContext";

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalState, setModalState] = useState<ModalState>({
    open: false,
    content: null,
  });

  const showModal = useCallback<ModalContextType["showModal"]>((modal) => {
    setModalState({ ...modal, open: true });
  }, []);

  const showErrorModal = useCallback<ModalContextType["showErrorModal"]>((message) => {
    showModal({
      variant: "error",
      title: "Error",
      content: message,
      actions: undefined,
      disableClose: false,
    });
  }, [showModal]);

  const closeModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, open: false }));
  }, []);

  const requestReauthentication: ModalContextType["requestReauthentication"] =
    () =>
      new Promise<string | null>((resolve) => {
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
                resolve(null);
              }}
            />
          ),
          actions: null,
          disableClose: true,
        });
      });

  const getModalActions = () => {
    if (modalState.actions === null) return null;

    if (modalState.actions !== undefined) return modalState.actions;

    const onlyConfirm =
      modalState.onlyConfirm !== undefined
        ? modalState.onlyConfirm
        : !modalState.onCancel;

    if (modalState.onConfirm || modalState.onCancel) {
      return (
        <ModalActions
          onlyConfirm={onlyConfirm}
          onCancel={
            modalState.onCancel
              ? () => {
                  closeModal();
                  setTimeout(() => modalState.onCancel?.(), 0);
                }
              : closeModal
          }
          onConfirm={
            modalState.onConfirm
              ? () => {
                  closeModal();
                  setTimeout(() => modalState.onConfirm?.(), 0);
                }
              : closeModal
          }
        />
      );
    }
    return (
      <Button onClick={closeModal} variant="contained" autoFocus>
        Got it
      </Button>
    );
  };

  return (
    <ModalContext.Provider
      value={{
        showModal,
        showErrorModal,
        closeModal,
        modalState,
        requestReauthentication,
      }}
    >
      {children}
      <AppModal
        open={modalState.open}
        onClose={modalState.disableClose ? undefined : closeModal}
        title={modalState.title}
        actions={getModalActions()}
        disableClose={modalState.disableClose}
        variant={modalState.variant}
      >
        {modalState.content}
      </AppModal>
    </ModalContext.Provider>
  );
};

export default ModalProvider;
