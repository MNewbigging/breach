import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/breach/", // replace with the repo name
  assetsInclude: ["**/*.gltf"],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  publicDir: "public",
  build: {
    outDir: "dist",
  },
});
