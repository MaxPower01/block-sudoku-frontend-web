import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "Block Sudoku",
        short_name: "Block Sudoku",
        theme_color: "#242424",
      },
    }),
  ],
  base: "/block-sudoku-frontend-web/",
});
