import { useNavigate } from "react-router-dom";

import { useModal } from "../../context/ModalContext/ModalContext";
import { paths } from "../../paths";
import { authService } from "../../services/authService";
import { getErrorMessage, isFirebaseCode } from "../../utils/errorUtils";

const useDeleteAccount = () => {
    const navigate = useNavigate();
    const { showModal, showErrorModal, requestReauthentication } = useModal();

    const removeAccount = async () => {
        try {
            try {
                await authService.deleteAccount();
            } catch (error) {
                if (!isFirebaseCode(error, "auth/requires-recent-login")) throw error;
                const user = authService.getCurrentUser();
                const password = user?.providerData.some((provider) => provider.providerId === "password")
                    ? await requestReauthentication() : undefined;
                if (password === null) return;
                await authService.reauthenticateUser(password);
                await authService.deleteAccount();
            }
            showModal({
                title: "Account deleted",
                content: "Your account has been deleted. Profile cleanup is handled automatically.",
                variant: "success",
                onConfirm: () => navigate(paths.LOGIN),
            });
        } catch (error) {
            showErrorModal(getErrorMessage(error));
        }
    };

    return () => showModal({
        title: "Are you sure?",
        content: "This action cannot be undone. Do you want to proceed?",
        variant: "warning",
        onlyConfirm: false,
        onConfirm: removeAccount,
    });
};

export default useDeleteAccount;
