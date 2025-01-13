import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  server: {
    host: "127.0.0.1",
    port: 3000, // Change to a different port if needed
    proxy: {
      "/api": {
        target: "https://qzbe80daoe.execute-api.us-east-1.amazonaws.com/dev",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
