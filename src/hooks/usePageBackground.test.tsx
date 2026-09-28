import { renderHook } from "@testing-library/react";
import { expect, it } from "vitest";

import { BackgroundProvider, useBackground } from "../context/BackgroundContext/BackgroundContext";

import usePageBackground from "./usePageBackground";

it("sets the page background and updates it when the image changes", () => {
  const { result, rerender } = renderHook(({ image }) => {
    usePageBackground(image);
    return useBackground().image;
  }, { initialProps: { image: "map.webp" }, wrapper: BackgroundProvider });
  expect(result.current).toBe("map.webp");
  rerender({ image: "hero.webp" });
  expect(result.current).toBe("hero.webp");
});
