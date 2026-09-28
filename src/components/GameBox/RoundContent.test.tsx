import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import RoundContent from "./RoundContent";

it("shows loading before a round and a retry if loading fails", () => {
  const retry = vi.fn();
  const children = vi.fn(() => <span>Question</span>);
  const { rerender } = render(
    <RoundContent round={null} isLoading hasError={false} onRetry={retry}>{children}</RoundContent>
  );
  expect(screen.getByRole("progressbar")).toBeInTheDocument();
  expect(children).not.toHaveBeenCalled();
  rerender(<RoundContent round={null} isLoading={false} hasError onRetry={retry}>{children}</RoundContent>);
  fireEvent.click(screen.getByRole("button", { name: "Try again" }));
  expect(retry).toHaveBeenCalledOnce();
  expect(children).not.toHaveBeenCalled();
});

it("keeps the round visible when submitting an answer fails", () => {
  render(
    <RoundContent round={{ name: "Annie" }} isLoading={false} hasError onRetry={vi.fn()}>
      {(round) => <span>{round.name}</span>}
    </RoundContent>
  );
  expect(screen.getByRole("alert")).toHaveTextContent("Choose it again to retry");
  expect(screen.getByText("Annie")).toBeInTheDocument();
});
