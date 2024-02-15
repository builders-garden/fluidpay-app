/** @type {import("prettier").Config} */
const config = {
  embeddedLanguageFormatting: "auto",
  htmlWhitespaceSensitivity: "css",
  printWidth: 100,
  proseWrap: "always",
  quoteProps: "as-needed",
  singleQuote: true,
  tabWidth: 2,
  trailingComma: "all",
  plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
