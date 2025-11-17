#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// --- Helper: run shell commands ---
function run(cmd, options = {}) {
  console.log(`\n▶ Running: ${cmd}`);
  execSync(cmd, { stdio: "inherit", ...options });
}

// --- Get project name from CLI argument ---
const projectName = process.argv[2] || "my-react-app";

console.log("\n🚀 React + Vite + Tailwind v4 + Router Quick Starter");
console.log(`📁 Project name: ${projectName}`);
console.log("ℹ️ When Vite asks 'Install with npm and start now?', choose NO.\n");

// 1) Create Vite + React app
run(`npm create vite@latest ${projectName} -- --template react`);

// 2) Move into project folder
process.chdir(projectName);

// 3) Install base deps
run("npm install");

// 4) Install Tailwind v4 + Vite plugin
run("npm install -D tailwindcss @tailwindcss/vite");

// 5) Install common frontend libs
run("npm install axios react-router-dom");

// 6) Update vite.config.[jt]s to use @tailwindcss/vite
const viteConfigJs = "vite.config.js";
const viteConfigTs = "vite.config.ts";
let viteConfigFile = null;

if (fs.existsSync(viteConfigJs)) {
  viteConfigFile = viteConfigJs;
} else if (fs.existsSync(viteConfigTs)) {
  viteConfigFile = viteConfigTs;
}

if (viteConfigFile) {
  let viteConfig = fs.readFileSync(viteConfigFile, "utf-8");

  // Add import for @tailwindcss/vite if missing
  if (!viteConfig.includes("@tailwindcss/vite")) {
    viteConfig = `import tailwindcss from "@tailwindcss/vite";\n` + viteConfig;
  }

  // Add tailwindcss() to plugins array
  const pluginsRegex = /plugins:\s*\[(.*?)\]/s;
  if (pluginsRegex.test(viteConfig)) {
    viteConfig = viteConfig.replace(pluginsRegex, (match, inner) => {
      if (inner.includes("tailwindcss(")) return match; // already added
      const trimmed = inner.trim();
      const newInner = trimmed.length
        ? `${trimmed}, tailwindcss()`
        : "tailwindcss()";
      return `plugins: [${newInner}]`;
    });
    console.log(`✅ Updated ${viteConfigFile} with @tailwindcss/vite plugin`);
  } else {
    console.warn(
      `⚠️ Could not find plugins array in ${viteConfigFile} to add tailwindcss plugin.`
    );
  }

  fs.writeFileSync(viteConfigFile, viteConfig);
} else {
  console.warn("⚠️ No vite.config.js/ts found; skipping Tailwind plugin setup.");
}

// 7) Configure src/index.css for Tailwind v4
const indexCssPath = path.join("src", "index.css");
const indexCssContent = `@import "tailwindcss";

body {
  @apply bg-slate-950 text-slate-50 antialiased;
}
`;

if (fs.existsSync(indexCssPath)) {
  fs.writeFileSync(indexCssPath, indexCssContent);
  console.log("✅ Updated src/index.css with Tailwind v4 import and base styles");
} else {
  console.warn("⚠️ src/index.css not found; skipping Tailwind CSS setup.");
}

// 8) Create routes, layouts, and pages folders
const routesDir = path.join("src", "routes");
const layoutsDir = path.join("src", "layouts");
const pagesDir = path.join("src", "pages");

fs.mkdirSync(routesDir, { recursive: true });
fs.mkdirSync(layoutsDir, { recursive: true });
fs.mkdirSync(pagesDir, { recursive: true });

// 9) Create AppRoutes.jsx
const appRoutesPath = path.join(routesDir, "AppRoutes.jsx");
const appRoutesContent = `import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";
import Home from "../pages/Home.jsx";
import About from "../pages/About.jsx";
import NotFound from "../pages/NotFound.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
`;
fs.writeFileSync(appRoutesPath, appRoutesContent);
console.log("✅ Created src/routes/AppRoutes.jsx");

// 10) Create MainLayout.jsx
const mainLayoutPath = path.join(layoutsDir, "MainLayout.jsx");
const mainLayoutContent = `import { NavLink, Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <span className="text-lg font-bold text-teal-400">
            Fast React Starter
          </span>
          <div className="flex gap-4 text-sm">
            <NavLink
              to="/"
              className={({ isActive }) =>
                \`hover:text-teal-300 \${isActive ? "text-teal-400 font-semibold" : "text-slate-200"}\`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                \`hover:text-teal-300 \${isActive ? "text-teal-400 font-semibold" : "text-slate-200"}\`
              }
            >
              About
            </NavLink>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
`;
fs.writeFileSync(mainLayoutPath, mainLayoutContent);
console.log("✅ Created src/layouts/MainLayout.jsx");

// 11) Create Home.jsx
const homePath = path.join(pagesDir, "Home.jsx");
const homeContent = `export default function Home() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight text-teal-400">
        Welcome 👋
      </h1>
      <p className="text-slate-200">
        This starter comes with React, Vite, Tailwind CSS v4, React Router, and Axios
        pre-configured so you can start building instantly.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <h2 className="text-lg font-semibold text-slate-50">Tailwind Ready</h2>
          <p className="mt-1 text-sm text-slate-400">
            Utility classes are available via <code className="font-mono">@import "tailwindcss"</code> in <code className="font-mono">index.css</code>.
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <h2 className="text-lg font-semibold text-slate-50">Routing Setup</h2>
          <p className="mt-1 text-sm text-slate-400">
            Manage routes in <code className="font-mono">src/routes/AppRoutes.jsx</code>.
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <h2 className="text-lg font-semibold text-slate-50">API Ready</h2>
          <p className="mt-1 text-sm text-slate-400">
            Use <code className="font-mono">axios</code> for API calls anywhere in your app.
          </p>
        </div>
      </div>
    </section>
  );
}
`;
fs.writeFileSync(homePath, homeContent);
console.log("✅ Created src/pages/Home.jsx");

// 12) Create About.jsx
const aboutPath = path.join(pagesDir, "About.jsx");
const aboutContent = `export default function About() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight text-teal-400">
        About this template
      </h1>
      <p className="text-slate-200 text-sm leading-relaxed">
        This is a minimal starter wired for fast frontend prototyping: Tailwind v4 for styling,
        React Router for navigation, and Axios for API calls. Customize the layout,
        pages, and components to match your project's needs.
      </p>
    </section>
  );
}
`;
fs.writeFileSync(aboutPath, aboutContent);
console.log("✅ Created src/pages/About.jsx");

// 13) Create NotFound.jsx
const notFoundPath = path.join(pagesDir, "NotFound.jsx");
const notFoundContent = `import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight text-red-400">
        404 – Page not found
      </h1>
      <p className="text-slate-300">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="inline-flex items-center rounded-lg border border-teal-500 px-4 py-2 text-sm font-medium text-teal-200 hover:bg-teal-500/10"
      >
        ← Back to home
      </Link>
    </section>
  );
}
`;
fs.writeFileSync(notFoundPath, notFoundContent);
console.log("✅ Created src/pages/NotFound.jsx");

// NEW: Create App.jsx that uses AppRoutes
const appPath = path.join("src", "App.jsx");
const appContent = `import AppRoutes from "./routes/AppRoutes.jsx";

export default function App() {
  return <AppRoutes />;
}
`;
fs.writeFileSync(appPath, appContent);
console.log("✅ Created src/App.jsx");


// 14) Update main.jsx to use BrowserRouter + AppRoutes
const mainPath = path.join("src", "main.jsx");
if (fs.existsSync(mainPath)) {
  const mainContent = `import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
`;
  fs.writeFileSync(mainPath, mainContent);
  console.log("✅ Updated src/main.jsx with BrowserRouter and AppRoutes");
} else {
  console.warn("⚠️ src/main.jsx not found; skipping Router setup.");
}

console.log(`
🎉 Setup complete!

Next steps:
  cd ${projectName}
  npm run dev

You now have:
  - React + Vite
  - Tailwind CSS v4 (via @tailwindcss/vite)
  - React Router with basic pages
  - Axios installed for API calls
`);
