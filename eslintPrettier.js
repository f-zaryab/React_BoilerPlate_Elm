import { execa } from "execa";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

export async function setupLintPrettier(projectRoot) {
  console.log(chalk.yellow("Installing ESLint + Prettier..."));

  await execa(
    "npm",
    [
      "install",
      "-D",
      "eslint",
      "prettier",
      "eslint-plugin-prettier",
      "eslint-config-prettier",
      "@typescript-eslint/eslint-plugin",
      "@typescript-eslint/parser",
    ],
    { cwd: projectRoot, stdio: "inherit" }
  );

  // ESLint CommonJS flat config
  const eslintConfig = `/** @type {import('eslint').FlatConfig[]} */
module.exports = [
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      prettier: require("eslint-plugin-prettier")
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "@typescript-eslint/no-unused-vars": ["warn"],
      "@typescript-eslint/explicit-function-return-type": "off",
      "prettier/prettier": "error"
    },
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended"
    ]
  }
];`;

  await fs.writeFile(path.join(projectRoot, "eslint.config.cjs"), eslintConfig);

  // Prettier
  const prettierConfig = `{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 80
}`;
  await fs.writeFile(path.join(projectRoot, ".prettierrc"), prettierConfig);

  // Add scripts
  const pkgPath = path.join(projectRoot, "package.json");
  const pkg = await fs.readJson(pkgPath);
  pkg.scripts.lint = "eslint . --ext ts,tsx";
  pkg.scripts.format = "prettier --write .";
  await fs.writeJson(pkgPath, pkg, { spaces: 2 });

  console.log(chalk.green("ESLint + Prettier setup complete!"));
}
