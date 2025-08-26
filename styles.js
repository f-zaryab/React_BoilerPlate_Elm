import fs from "fs-extra";
import path from "path";
import { execa } from "execa";
import chalk from "chalk";

export async function setupStyles(projectRoot, cssFramework) {
  const srcDir = path.join(projectRoot, "src");

  if (cssFramework === "Tailwind CSS") {
    console.log(chalk.yellow("Setting up Tailwind CSS v4..."));

    // Install Tailwind v4 and Vite plugin
    await execa(
      "npm",
      ["install", "-D", "tailwindcss@4", "@tailwindcss/vite"],
      { cwd: projectRoot, stdio: "inherit" }
    );

    // Update vite.config.ts to include Tailwind plugin safely
    const viteConfigPath = path.join(projectRoot, "vite.config.ts");
    let viteConfig = await fs.readFile(viteConfigPath, "utf-8");

    // Ensure tailwindcss import exists
    if (!viteConfig.includes("@tailwindcss/vite")) {
      viteConfig = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
`;
      await fs.writeFile(viteConfigPath, viteConfig);
    }

    // Update index.css to import Tailwind
    const indexCss = `@import "tailwindcss";`;
    await fs.writeFile(path.join(srcDir, "index.css"), indexCss);

    // Keep App.css empty
    await fs.writeFile(path.join(srcDir, "App.css"), "");

    console.log(chalk.green("Tailwind CSS v4 setup complete!"));
  } else {
    // Manual CSS setup
    const indexCssContent = `:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color-scheme: light dark;
  color: rgba(0, 0, 0, 0.87);
  background-color: #ffffff;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  box-sizing: content-box;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
  a:hover {
    color: #747bff;
  }
}`;
    await fs.writeFile(path.join(srcDir, "index.css"), indexCssContent);

    const appCssContent = `#root {
  width: 100%;
  height: 100%;
}

@keyframes logo-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: no-preference) {
  a:nth-of-type(2) .logo { animation: logo-spin infinite 20s linear; }
}`;
    await fs.writeFile(path.join(srcDir, "App.css"), appCssContent);

    console.log(chalk.green("Manual CSS setup complete!"));
  }
}
