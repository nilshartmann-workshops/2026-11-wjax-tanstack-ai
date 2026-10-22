import tailwindcss from "@tailwindcss/vite";
import tanstackRouter from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  // tanstackRouter() muss vor react() stehen; dahinter scheitern
  // Routenerzeugung und Transformation still.
  plugins: [
    tanstackRouter({ autoCodeSplitting: false }),
    tailwindcss(),
    react(),
  ],
  server: {
    // Alle Ports dieses Projekts liegen im 63er-Block: Frontend 63000,
    // API-Server 63080, Chat-Server 63081. strictPort, damit Vite nicht auf
    // einen anderen Port ausweicht und die URL im Vortrag nicht mehr stimmt.
    port: 63000,
    strictPort: true,
    // Der Proxy spart CORS in beiden Servern. Der Eintrag für /api/chat steht
    // vor /api, weil Vite den ersten passenden Eintrag nimmt.
    proxy: {
      "/api/chat": {
        target: "http://localhost:63081",
        changeOrigin: true,
      },
      "/api": {
        target: "http://localhost:63080",
        changeOrigin: true,
      },
    },
  },
});
