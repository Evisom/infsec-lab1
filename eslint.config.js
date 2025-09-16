import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node
      }
    },
    plugins: {
      security: await import("eslint-plugin-security")
    },
    rules: {
      "security/detect-object-injection": "off"
    }
  }
];
