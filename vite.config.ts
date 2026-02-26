import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import pkg from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/breach/", // replace with the repo name
  assetsInclude: ["**/*.gltf"],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  publicDir: "public",
  build: {
    outDir: "dist",
  },
});
