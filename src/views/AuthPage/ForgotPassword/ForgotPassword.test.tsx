import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, expect, it, vi } from "vitest";

import { authService } from "../../../services/authService";

import ForgotPassword from "./ForgotPassword";

const showModal = vi.fn();
vi.mock("../../../context/ModalContext/ModalContext", () => ({ useModal: () => ({ showModal }) }));
vi.mock("../../../services/authService", () => ({ authService: { sendResetPassword: vi.fn() } }));

beforeEach(() => vi.resetAllMocks());

it("waits for the reset email before reporting success and blocks repeat submissions", async () => {
    let complete: () => void = () => {};
    vi.mocked(authService.sendResetPassword).mockImplementationOnce(() => new Promise((resolve) => { complete = resolve; }));
    render(<MemoryRouter><ForgotPassword /></MemoryRouter>);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "test@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Send email" }));
    await waitFor(() => expect(authService.sendResetPassword).toHaveBeenCalledOnce());
    expect(showModal).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Send email" })).toBeDisabled();
    await act(async () => complete());
    expect(showModal).toHaveBeenCalledWith(expect.objectContaining({ variant: "success" }));
});

it("reports a rejected email request without showing success", async () => {
    vi.mocked(authService.sendResetPassword).mockRejectedValueOnce(new Error("offline"));
    render(<MemoryRouter><ForgotPassword /></MemoryRouter>);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "test@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Send email" }));
    await waitFor(() => expect(showModal).toHaveBeenCalledWith(expect.objectContaining({ variant: "error", content: "offline" })));
    expect(showModal).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Send email" })).toBeEnabled();
});
