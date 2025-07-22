import { ReactNode } from "react";

export type AppModalVariant =
    | "default"
    | "info"
    | "success"
    | "error"
    | "warning"
    | "confirm";

export interface ModalState {
    open: boolean;
    content: ReactNode | null;
    title?: string;
    actions?: ReactNode;
    disableClose?: boolean;
    variant?: AppModalVariant;
    onClose?: () => void;
    onConfirm?: () => void;
    onCancel?: () => void;
    onlyConfirm?: boolean;
}

export interface ModalContextType {
    showModal: (modal: Omit<ModalState, "open">) => void;
    showErrorModal: (message: string) => void;
    closeModal: () => void;
    modalState: ModalState;
    requestReauthentication: () => Promise<string>;
}
