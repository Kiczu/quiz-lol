import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import AnswerOptions from "./AnswerOptions";

it("supports text-only choices and blocks used or submitting answers", () => {
  const select = vi.fn();
  const options = [{ id: "annie", name: "Annie", icon: "annie.png" }, { id: "ionia", name: "Ionia" }];
  const { rerender } = render(
    <AnswerOptions options={options} usedIds={["annie"]} columns={2} onSelect={select} />
  );
  expect(screen.getByRole("button", { name: "Annie" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Ionia" }));
  expect(select).toHaveBeenCalledWith("ionia");
  rerender(<AnswerOptions options={options} columns={2} onSelect={select} disabled />);
  expect(screen.getByRole("button", { name: "Ionia" })).toBeDisabled();
});
