import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import Footer from "./Footer";

const renderFooter = () =>
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );

describe("Footer", () => {
  it("shows the Riot Games disclaimer", () => {
    renderFooter();
    expect(
      screen.getByText(/Riot Games does not endorse or sponsor this project/)
    ).toBeInTheDocument();
  });

  it("links to the privacy policy", () => {
    renderFooter();
    expect(screen.getByRole("link", { name: /privacy policy/i })).toHaveAttribute(
      "href",
      "/privacy"
    );
  });
});
