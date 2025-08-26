#!/usr/bin/env node

import chalk from "chalk";
import { mainPrompt, pagePrompt, cssFrameworkPrompt } from "./prompts.js";
import { createProjectFolders } from "./folders.js";
import { setupStyles } from "./styles.js";
import { setupComponents } from "./components.js";
import { setupRouterAndPages } from "./router.js";
import { setupLintPrettier } from "./eslintPrettier.js";

async function main() {
  console.log(chalk.cyan("Welcome to React-Generation-CLI :)"));

  const projectName = await mainPrompt();
  const pagesList = await pagePrompt();
  const cssFramework = await cssFrameworkPrompt();

  const projectRoot = await createProjectFolders(projectName);
  await setupLintPrettier(projectRoot);
  await setupStyles(projectRoot, cssFramework);
  await setupComponents(projectRoot, pagesList, cssFramework);
  await setupRouterAndPages(projectRoot, pagesList);

  console.log(chalk.green("\nProject setup completed!"));
  console.log(
    chalk.green(`👉 cd ${projectName} && npm install && npm run dev`)
  );
  console.log(chalk.green("Lint with: npm run lint"));
  console.log(chalk.green("Format with: npm run format"));
}

main();
