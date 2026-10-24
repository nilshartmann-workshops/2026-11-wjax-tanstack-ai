import tailwindcss from "@tailwindcss/vite";
import tanstackRouter from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { slowResponseMs } from "./src/demo-config.ts";

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
    // Alle Ports dieses Projekts liegen im 26er-Block: Frontend 26000,
    // API-Server 26080, Chat-Server 26081. strictPort, damit Vite nicht auf
    // einen anderen Port ausweicht und die URL im Vortrag nicht mehr stimmt.
    port: 26000,
    strictPort: true,
    // Der Proxy spart CORS in beiden Servern. Der Eintrag für /api/chat steht
    // vor /api, weil Vite den ersten passenden Eintrag nimmt.
    proxy: {
      "/api/chat": {
        target: "http://localhost:26081",
        changeOrigin: true,
        // Demo-Hilfe: verlangsamt die Antworten, siehe demo-config.ts. Der
        // Proxy setzt den Header, damit der Aufruf im Chat-Panel davon frei
        // bleibt.
        headers:
          slowResponseMs > 0 ? { "x-huetly-slow": String(slowResponseMs) } : {},
      },
      "/api": {
        target: "http://localhost:26080",
        changeOrigin: true,
      },
    },
  },
});
