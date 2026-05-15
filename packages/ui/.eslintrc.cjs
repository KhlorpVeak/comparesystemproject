/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  ignorePatterns: [".eslintrc.cjs"],
  extends: ["@comparesystem/eslint-config/index.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
};
