import { act, renderHook } from "@testing-library/react";
import { FirebaseError } from "firebase/app";
import { User } from "firebase/auth";
import { beforeEach, expect, it, vi } from "vitest";

import { authService } from "../../services/authService";

import useDeleteAccount from "./useDeleteAccount";

const showModal = vi.fn();
const showErrorModal = vi.fn();
const requestReauthentication = vi.fn();
vi.mock("react-router-dom", () => ({ useNavigate: () => vi.fn() }));
vi.mock("../../context/ModalContext/ModalContext", () => ({
    useModal: () => ({ showModal, showErrorModal, requestReauthentication }),
}));
vi.mock("../../services/authService", () => ({ authService: {
    deleteAccount: vi.fn(), getCurrentUser: vi.fn(), reauthenticateUser: vi.fn(),
} }));

beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(authService.deleteAccount).mockResolvedValue(undefined);
    vi.mocked(authService.reauthenticateUser).mockResolvedValue({} as never);
    vi.mocked(authService.getCurrentUser).mockReturnValue({ providerData: [{ providerId: "password" }] } as User);
});

const confirmDeletion = async () => {
    const view = renderHook(useDeleteAccount);
    act(() => view.result.current());
    expect(authService.deleteAccount).not.toHaveBeenCalled();
    await act(async () => showModal.mock.calls[0][0].onConfirm());
};

it("deletes only after confirmation and reports success once", async () => {
    await confirmDeletion();
    expect(authService.deleteAccount).toHaveBeenCalledOnce();
    expect(showModal.mock.calls.filter(([modal]) => modal.variant === "success")).toHaveLength(1);
});

it("reauthenticates a password account and retries the same deletion", async () => {
    vi.mocked(authService.deleteAccount).mockRejectedValueOnce(new FirebaseError("auth/requires-recent-login", "reauthenticate"));
    requestReauthentication.mockResolvedValue("password");
    await confirmDeletion();
    expect(authService.reauthenticateUser).toHaveBeenCalledWith("password");
    expect(authService.deleteAccount).toHaveBeenCalledTimes(2);
});

it("uses the provider popup for a Google account", async () => {
    vi.mocked(authService.getCurrentUser).mockReturnValue({ providerData: [{ providerId: "google.com" }] } as User);
    vi.mocked(authService.deleteAccount).mockRejectedValueOnce(new FirebaseError("auth/requires-recent-login", "reauthenticate"));
    await confirmDeletion();
    expect(requestReauthentication).not.toHaveBeenCalled();
    expect(authService.reauthenticateUser).toHaveBeenCalledWith(undefined);
    expect(authService.deleteAccount).toHaveBeenCalledTimes(2);
});

it("cancels reauthentication without retrying or showing an error", async () => {
    vi.mocked(authService.deleteAccount).mockRejectedValueOnce(new FirebaseError("auth/requires-recent-login", "reauthenticate"));
    requestReauthentication.mockResolvedValue(null);
    await confirmDeletion();
    expect(authService.deleteAccount).toHaveBeenCalledOnce();
    expect(showErrorModal).not.toHaveBeenCalled();
});

it("reports failures without announcing a successful deletion", async () => {
    vi.mocked(authService.deleteAccount).mockRejectedValueOnce(new Error("offline"));
    await confirmDeletion();
    expect(showErrorModal).toHaveBeenCalledWith("offline");
    expect(showModal.mock.calls.filter(([modal]) => modal.variant === "success")).toHaveLength(0);
});
