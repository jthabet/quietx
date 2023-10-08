module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "plugin:prettier/recommended",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:storybook/recommended"
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs","prettier.config.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["prettier", "react-refresh"],
  rules: {
    "prettier/prettier": "error",
    "no-unused-vars": "off",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
  },
};
