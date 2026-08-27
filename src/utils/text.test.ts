import { describe, expect, it } from "vitest";

import { htmlToPlainText } from "./text";

describe("htmlToPlainText", () => {
  it("turns line break tags into new lines", () => {
    expect(htmlToPlainText("First cast:<br>Dashes.<br/>Strikes.")).toBe(
      "First cast:\nDashes.\nStrikes."
    );
  });

  it("drops other markup but keeps the text inside it", () => {
    expect(
      htmlToPlainText("Deals <magicDamage>150 damage</magicDamage> to enemies.")
    ).toBe("Deals 150 damage to enemies.");
  });

  it("handles tags carrying attributes", () => {
    expect(htmlToPlainText("A <font color='#6655cc'>Wind Wall</font> blocks.")).toBe(
      "A Wind Wall blocks."
    );
  });

  it("leaves plain text untouched", () => {
    expect(htmlToPlainText("No markup here.")).toBe("No markup here.");
  });
});
