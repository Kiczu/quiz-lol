import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { useAuth } from "../../context/LoginContext/LoginContext";
import { paths } from "../../paths";

import RequireAuth from "./RequireAuth";

vi.mock("../../context/LoginContext/LoginContext", () => ({
  useAuth: vi.fn(),
}));

const renderGuarded = () =>
  render(
    <MemoryRouter initialEntries={[paths.HANGMAN]}>
      <Routes>
        <Route
          path={paths.HANGMAN}
          element={
            <RequireAuth>
              <p>Secret game</p>
            </RequireAuth>
          }
        />
        <Route path={paths.LOGIN} element={<p>Sign in page</p>} />
      </Routes>
    </MemoryRouter>
  );

describe("RequireAuth", () => {
  it("waits instead of redirecting while the session is restoring", () => {
    vi.mocked(useAuth).mockReturnValue({ userData: null, isLoading: true } as never);

    renderGuarded();

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.queryByText("Sign in page")).not.toBeInTheDocument();
  });

  it("sends a signed out visitor to the login page", () => {
    vi.mocked(useAuth).mockReturnValue({ userData: null, isLoading: false } as never);

    renderGuarded();

    expect(screen.getByText("Sign in page")).toBeInTheDocument();
    expect(screen.queryByText("Secret game")).not.toBeInTheDocument();
  });

  it("lets a signed in player through", () => {
    vi.mocked(useAuth).mockReturnValue({
      userData: { uid: "abc" },
      isLoading: false,
    } as never);

    renderGuarded();

    expect(screen.getByText("Secret game")).toBeInTheDocument();
  });
});
