import { expect, it } from "vitest";
import * as yup from "yup";

import { confirmPasswordSchema, passwordSchema } from "./passwordValidation";

it.each(["", "Aa1!", "abcdefgh1!", "Abcdefgh!", "Abcdefgh1"])("rejects weak passwords: %s", (password) => {
  expect(passwordSchema.isValidSync(password)).toBe(false);
});

it("accepts a password satisfying all existing requirements", () => {
  expect(passwordSchema.isValidSync("Abcdefgh1!")).toBe(true);
});

it.each(["password", "newPassword"])("checks confirmation against %s", (field) => {
  const schema = yup.object({ [field]: passwordSchema, confirm: confirmPasswordSchema(field) });
  expect(schema.isValidSync({ [field]: "Abcdefgh1!", confirm: "Abcdefgh1!" })).toBe(true);
  expect(schema.isValidSync({ [field]: "Abcdefgh1!", confirm: "Different1!" })).toBe(false);
  expect(schema.isValidSync({ [field]: "Abcdefgh1!", confirm: "" })).toBe(false);
});
