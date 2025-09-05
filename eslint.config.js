// eslint.config.js
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-config-prettier";

export default [
  { ignores: ["dist", "build", "coverage"] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      "no-console": "off",
    },
    settings: {
      "import/resolver": {
        node: { extensions: [".js", ".ts", ".tsx"] },
        typescript: true,
      },
    },
  },

  prettier,
];
