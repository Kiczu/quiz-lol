import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import CustomTabPanel from "./CustomTabPanel";

describe("CustomTabPanel", () => {
  it("shows its children when the matching tab is selected", () => {
    render(
      <CustomTabPanel value={1} index={1}>
        <p>Spell details</p>
      </CustomTabPanel>
    );

    expect(screen.getByText("Spell details")).toBeInTheDocument();
  });

  it("stays hidden and renders nothing for the other tabs", () => {
    render(
      <CustomTabPanel value={0} index={1}>
        <p>Spell details</p>
      </CustomTabPanel>
    );

    expect(screen.queryByText("Spell details")).not.toBeInTheDocument();
    expect(screen.getByRole("tabpanel", { hidden: true })).toBeInTheDocument();
  });

  it("links itself to the tab that controls it", () => {
    render(
      <CustomTabPanel value={2} index={2}>
        <p>Spell details</p>
      </CustomTabPanel>
    );

    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveAttribute("id", "simple-tabpanel-2");
    expect(panel).toHaveAttribute("aria-labelledby", "simple-tab-2");
  });
});
