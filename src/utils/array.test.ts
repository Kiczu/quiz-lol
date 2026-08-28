import { describe, expect, it } from "vitest";

import { shuffle } from "./array";

describe("shuffle", () => {
  it("keeps every item", () => {
    const items = [1, 2, 3, 4, 5];
    expect(shuffle(items).sort()).toEqual(items);
  });

  it("leaves the original array untouched", () => {
    const items = [1, 2, 3, 4, 5];
    shuffle(items);
    expect(items).toEqual([1, 2, 3, 4, 5]);
  });

  it("copes with empty and single item arrays", () => {
    expect(shuffle([])).toEqual([]);
    expect(shuffle(["only"])).toEqual(["only"]);
  });

  it("eventually produces a different order", () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8];
    const orders = new Set(
      Array.from({ length: 40 }, () => shuffle(items).join(","))
    );
    expect(orders.size).toBeGreaterThan(1);
  });
});
