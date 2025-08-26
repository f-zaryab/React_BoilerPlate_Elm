import fs from "fs-extra";
import path from "path";
import { execa } from "execa";
import chalk from "chalk";

export async function createProjectFolders(projectName) {
  // Create Vite React TSX project
  await execa(
    "npm",
    ["create", "vite@latest", projectName, "--", "--template", "react-ts"],
    { stdio: "inherit" }
  );

  const projectRoot = path.join(process.cwd(), projectName);
  const srcDir = path.join(projectRoot, "src");

  const folders = [
    "app/pages",
    "app/router",
    "app/layout",
    "components",
    "features",
    "lib",
  ];

  for (const folder of folders) {
    await fs.ensureDir(path.join(srcDir, folder));
  }

  // Install react-router-dom
  console.log(chalk.yellow("Installing react-router-dom..."));
  
  await execa("npm", ["install", "react-router-dom@latest"], {
    cwd: projectRoot,
    stdio: "inherit",
  });

  return projectRoot;
}
