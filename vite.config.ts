import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/breach/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      manifest: {
        name: "Breach",
        short_name: "Breach",
        description: "Word puzzler",
        display: "standalone",
        theme_color: "#000000",
        background_color: "#000000",
        icons: [
          { src: "icon_192.png", sizes: "192x192", type: "image/png" },
          { src: "icon_512.png", sizes: "512x512", type: "image/png" },
        ],
      },
      includeAssets: ["dictionary.txt"],
    }),
  ],
});
