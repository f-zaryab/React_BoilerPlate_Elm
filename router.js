import fs from "fs-extra";
import path from "path";

export async function setupRouterAndPages(projectRoot, pagesList) {
  const srcDir = path.join(projectRoot, "src");
  const pagesDir = path.join(srcDir, "app/pages");
  const routerDir = path.join(srcDir, "app/router");

  const pageImports = [];
  const routeEntries = [];

  for (const page of pagesList) {
    const fileName = `${page}.tsx`;
    const filePath = path.join(pagesDir, fileName);
    const content = `const ${page} = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "stretch",
        height: "100%",
        padding: "1rem",
      }}
    >
      <h1>Welcome to page: ${page}</h1>
    </div>
  )  
}

export default ${page};`;
    await fs.writeFile(filePath, content);

    pageImports.push(`import ${page} from "../pages/${page}";`);

    const routePath = page.toLowerCase().includes("home")
      ? "/"
      : `/${page.toLowerCase().replace("page", "")}`;
    routeEntries.push(`{ path: "${routePath}", element: <${page}/> }`);
  }

  const routerContent = `import { createBrowserRouter } from "react-router";
import App from "../layout/App";
${pageImports.join("\n")}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [${routeEntries.join(",")}],
  },
]);`;

  await fs.writeFile(path.join(routerDir, "Route.tsx"), routerContent);
}
