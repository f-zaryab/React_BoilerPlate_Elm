import fs from "fs-extra";
import path from "path";

export async function setupComponents(projectRoot, pagesList, cssFramework) {
  const srcDir = path.join(projectRoot, "src");
  const componentsDir = path.join(srcDir, "components");
  const layoutDir = path.join(srcDir, "app/layout");

  // Navbar
  const navLinks = pagesList
    .map((p) => {
      const path = p.toLowerCase().includes("home")
        ? "/"
        : `/${p.toLowerCase().replace("page", "")}`;
      return `<Link to="${path}" style={{ marginRight: "1rem", color: "white" }}>${p.replace(
        "Page",
        ""
      )}</Link>`;
    })
    .join("\n");

  const NavbarContent = `import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav
      style={{
        padding: "1rem 0",
        borderBottom: "2px solid #ddd",
        position: "relative",
        top: "0rem",
        width: "100%",
        height: "2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "hsla(259, 84%, 78%, 1)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>Logo</div>
        <div style={{ marginLeft: "auto" }}>
          ${navLinks}
        </div>
      </div>
    </nav>
  );  
}

export default Navbar;`;

  await fs.writeFile(path.join(componentsDir, "Navbar.tsx"), NavbarContent);

  // Footer
  const FooterContent = `
const Footer = () => {
  return (
    <footer
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        background: "hsla(167, 68%, 73%, 1)",
        color: "white"
      }}
    >
      <h2>My Footer</h2>
    </footer>
  )  
}

export default Footer;`;

  const FooterContentTailwind = `
const Footer = () => {
  return (
    <footer
      className="w-full flex justify-center item-center text-white bg-green-300"
    >
      <h2>My Footer</h2>
    </footer>
  )  
}

export default Footer;
  `;

  await fs.writeFile(
    path.join(componentsDir, "Footer.tsx"),
    cssFramework === "Tailwind CSS" ? FooterContentTailwind : FooterContent
  );

  // App layout
  const AppTsxContent = `import { Outlet } from "react-router";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100%" }}>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;`;

  await fs.writeFile(path.join(layoutDir, "App.tsx"), AppTsxContent);

  // main.tsx
  const mainTsxContent = `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./app/router/Route";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);`;

  await fs.writeFile(path.join(srcDir, "main.tsx"), mainTsxContent);
}
