import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import daStyle from "eslint-config-dicodingacademy";
import eslintConfigPrettier from "eslint-config-prettier";
import jestPlugin from "eslint-plugin-jest";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node }
  },
  {
    ignores: ["**/node_modules/**", "**/dist/**"],
  },
  {
    files: ["**/*.test.{js,jsx,mjs,cjs}", "**/*.spec.{js,jsx,mjs,cjs}"],
    ...jestPlugin.configs["flat/recommended"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  daStyle,
  eslintConfigPrettier
]);
