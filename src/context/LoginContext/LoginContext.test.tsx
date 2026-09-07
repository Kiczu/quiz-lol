import { act, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RawUserData } from "../../api/types";
import { authService } from "../../services/authService";
import { userAggregateService } from "../../services/userAggregateService";

import { LoginProvider, useAuth } from "./LoginContext";

vi.mock("../../services/authService", () => ({
  authService: {
    onAuthStateChanged: vi.fn(),
    getCurrentUser: vi.fn(),
    registerUser: vi.fn(),
  },
}));

vi.mock("../../services/userAggregateService", () => ({
  userAggregateService: {
    getUserData: vi.fn(),
  },
}));

vi.mock("../ModalContext/ModalContext", () => ({
  useModal: () => ({ showModal: vi.fn(), showErrorModal: vi.fn() }),
}));

const profile: RawUserData = { uid: "u1", username: "kiczu" };

let notifyAuthChange: (user: unknown) => void;

const Probe = () => {
  const { userData, isLoading, handleRegister } = useAuth();

  return (
    <>
      <p>{isLoading ? "wczytywanie" : userData ? `profil: ${userData.username}` : "brak profilu"}</p>
      <button
        onClick={() =>
          handleRegister("adrian@test.pl", "haslo123", {
            username: "kiczu",
            firstName: "Adrian",
            lastName: "M",
          })
        }
      >
        register
      </button>
    </>
  );
};

const renderProvider = () =>
  render(
    <LoginProvider>
      <Probe />
    </LoginProvider>
  );

describe("LoginProvider registration", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(authService.onAuthStateChanged).mockImplementation((callback) => {
      notifyAuthChange = callback;
      return () => {};
    });
    vi.mocked(authService.getCurrentUser).mockReturnValue({
      uid: "u1",
      reload: vi.fn().mockResolvedValue(undefined),
    } as never);
  });

  it("leaves the session signed in with a profile once registration finishes", async () => {
    vi.mocked(userAggregateService.getUserData)
      .mockResolvedValueOnce(null)
      .mockResolvedValue(profile);

    vi.mocked(authService.registerUser).mockImplementation(async () => {
      notifyAuthChange({ uid: "u1" });
      return { uid: "u1" } as never;
    });

    renderProvider();
    await act(async () => notifyAuthChange(null));
    expect(screen.getByText("brak profilu")).toBeInTheDocument();

    await act(async () => {
      screen.getByRole("button", { name: "register" }).click();
    });

    await waitFor(() =>
      expect(screen.getByText("profil: kiczu")).toBeInTheDocument()
    );
  });

  it("ignores a slower refresh that would wipe a newer profile", async () => {
    let releaseSlowRead: (value: RawUserData | null) => void = () => {};

    vi.mocked(userAggregateService.getUserData)
      .mockImplementationOnce(
        () => new Promise((resolve) => { releaseSlowRead = resolve; })
      )
      .mockResolvedValue(profile);

    vi.mocked(authService.registerUser).mockResolvedValue({ uid: "u1" } as never);

    renderProvider();

    act(() => {
      notifyAuthChange({ uid: "u1" });
    });

    await act(async () => {
      screen.getByRole("button", { name: "register" }).click();
    });

    await waitFor(() =>
      expect(screen.getByText("profil: kiczu")).toBeInTheDocument()
    );

    await act(async () => releaseSlowRead(null));

    expect(screen.getByText("profil: kiczu")).toBeInTheDocument();
  });
});
