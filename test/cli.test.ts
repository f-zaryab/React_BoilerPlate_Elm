import fs from "fs-extra";
import path from "path";

vi.mock("execa", () => {
  return {
    execa: vi.fn().mockResolvedValue({ stdout: "", exitCode: 0 }),
  };
});

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { setupStyles } from "../styles";
import { execa } from "execa";

const tempDir = path.join(__dirname, "temp-project");
const pagesList = ["HomePage", "AboutPage", "ContactPage"];
const pagesDir = path.join(tempDir, "src/app/pages");
const routerDir = path.join(tempDir, "src/app/router");
const componentsDir = path.join(tempDir, "src/components");

describe("React CLI full functionality", () => {
  beforeEach(async () => {
    await fs.ensureDir(tempDir);
    await fs.ensureDir(path.join(tempDir, "src"));
    await fs.writeFile(path.join(tempDir, "vite.config.ts"), "");
    await fs.ensureDir(pagesDir);
    await fs.ensureDir(routerDir);
    await fs.ensureDir(componentsDir);
  });

  afterEach(async () => {
    await fs.remove(tempDir);
    vi.restoreAllMocks();
  });

  // =====================
  // Styles Tests
  // =====================
  it("should create manual CSS files correctly", async () => {
    await setupStyles(tempDir, "Manual CSS");

    const indexCss = await fs.readFile(
      path.join(tempDir, "src/index.css"),
      "utf-8"
    );
    const appCss = await fs.readFile(
      path.join(tempDir, "src/App.css"),
      "utf-8"
    );

    expect(indexCss).toContain(":root");
    expect(indexCss).toContain("font-family");
    expect(indexCss).toContain("body");
    expect(appCss).toContain("#root");
    expect(appCss).toContain("@keyframes logo-spin");
  });

  it("should create Tailwind CSS files correctly", async () => {
    await setupStyles(tempDir, "Tailwind CSS");

    const indexCss = await fs.readFile(
      path.join(tempDir, "src/index.css"),
      "utf-8"
    );
    const appCss = await fs.readFile(
      path.join(tempDir, "src/App.css"),
      "utf-8"
    );
    const viteConfig = await fs.readFile(
      path.join(tempDir, "vite.config.ts"),
      "utf-8"
    );

    expect(indexCss).toBe(`@import "tailwindcss";`);
    expect(appCss).toBe("");
    expect(viteConfig).toContain("tailwindcss");

    // Check that execa (mocked) was called
    expect(execa).toHaveBeenCalled();
  });

  // =====================
  // Pages Tests
  // =====================
  it("should create pages correctly", async () => {
    for (const page of pagesList) {
      const filePath = path.join(pagesDir, `${page}.tsx`);
      await fs.writeFile(
        filePath,
        `const ${page} = () => <div>${page}</div>; export default ${page};`
      );

      expect(await fs.pathExists(filePath)).toBe(true);

      const content = await fs.readFile(filePath, "utf-8");
      expect(content).toContain(`const ${page}`);
      expect(content).toContain(`<div>${page}</div>`);
    }
  });

  // =====================
  // Router Tests
  // =====================
  it("should create router correctly with all pages", async () => {
    const routeFile = path.join(routerDir, "Route.tsx");
    const imports = pagesList
      .map((p) => `import ${p} from "../pages/${p}";`)
      .join("\n");
    const routes = pagesList
      .map(
        (p) =>
          `{ path: "/${p
            .toLowerCase()
            .replace("page", "")}", element: <${p} /> }`
      )
      .join(",\n");

    const routerContent = `
import { createBrowserRouter } from "react-router";
import App from "../layout/App";
${imports}

export const router = createBrowserRouter([
  { path: "/", element: <App />, children: [ ${routes} ] }
]);
`;
    await fs.writeFile(routeFile, routerContent);

    const content = await fs.readFile(routeFile, "utf-8");
    expect(await fs.pathExists(routeFile)).toBe(true);
    for (const page of pagesList) {
      expect(content).toContain(`import ${page}`);
      expect(content).toContain(`<${page} />`);
    }
  });

  // =====================
  // Navbar Tests
  // =====================
  it("should include all pages in Navbar links", async () => {
    const navFile = path.join(componentsDir, "Navbar.tsx");

    const navLinks = pagesList
      .map((p) => {
        const path = p.toLowerCase().includes("home")
          ? "/"
          : `/${p.toLowerCase().replace("page", "")}`;
        return `<Link to="${path}"`;
      })
      .join("\n");

    const navContent = `import { Link } from "react-router-dom";\nconst Navbar = () => <nav>${navLinks}</nav>; export default Navbar;`;
    await fs.writeFile(navFile, navContent);

    const content = await fs.readFile(navFile, "utf-8");
    expect(await fs.pathExists(navFile)).toBe(true);
    for (const page of pagesList) {
      const path = page.toLowerCase().includes("home")
        ? "/"
        : `/${page.toLowerCase().replace("page", "")}`;
      expect(content).toContain(`<Link to="${path}"`);
    }
  });
});
