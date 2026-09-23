import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import reactPlugin from "eslint-plugin-react";

export default [
  {
    ignores: ["**/node_modules/**", "build", "public", "functions/lib/**"],
  },
  {
    files: ["src/**/*.{js,jsx,ts,tsx}", "functions/src/**/*.ts"],
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      import: importPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {},
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "func-style": ["error", "expression"],
      "prefer-arrow-callback": ["error", { allowUnboundThis: false }],
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          alphabetize: { order: "asc", caseInsensitive: true },
          "newlines-between": "always",
        },
      ],
    },
  },
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [{
          regex: "(^|/)functions/(?!src/contracts/)",
          message: "Browser code may only import public Functions contracts.",
        }],
      }],
    },
  },
  {
    files: ["functions/src/contracts/**/*.ts"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [{ regex: ".", message: "Public contracts must stay dependency-free." }],
      }],
    },
  },
];
