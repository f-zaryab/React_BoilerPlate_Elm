import inquirer from "inquirer";

export async function mainPrompt() {
  const { projectName } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Enter the project name please: ",
      default: "my-react-vite-app",
    },
  ]);
  return projectName;
}

export async function pagePrompt() {
  const { pages } = await inquirer.prompt([
    {
      type: "input",
      name: "pages",
      message: "Enter page names (comma separated): ",
      default: "Home, About, Contact",
    },
  ]);
  return [
    ...new Set(
      pages
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean)
    ),
  ];
}

export async function cssFrameworkPrompt() {
  const { cssFramework } = await inquirer.prompt([
    {
      type: "list",
      name: "cssFramework",
      message: "Select CSS framework:",
      choices: ["Manual CSS", "Tailwind CSS"],
      default: "Manual CSS",
    },
  ]);
  return cssFramework;
}
