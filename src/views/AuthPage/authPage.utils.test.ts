import { beforeEach, describe, expect, it } from "vitest";

import { getRandomImage } from "./authPage.utils";

describe("getRandomImage", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("returns an official Data Dragon splash art", () => {
    expect(getRandomImage()).toMatch(
      /^https:\/\/ddragon\.leagueoflegends\.com\/cdn\/img\/champion\/splash\/\w+_0\.jpg$/
    );
  });

  it("reuses the background stored for the session", () => {
    const first = getRandomImage();
    expect(getRandomImage()).toBe(first);
  });

  it("replaces a stored background that no longer exists", () => {
    sessionStorage.setItem("backgroundImage", "/assets/gone-forever.jpeg");

    const picked = getRandomImage();

    expect(picked).not.toBe("/assets/gone-forever.jpeg");
    expect(sessionStorage.getItem("backgroundImage")).toBe(picked);
  });
});
