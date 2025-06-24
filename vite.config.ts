/* eslint-disable @typescript-eslint/no-require-imports */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { vitePrerenderPlugin } from "vite-prerender-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vitePrerenderPlugin({
      renderTarget: "#root", // or whatever your root element is
      prerenderScript: path.resolve(__dirname, "prerender.js"),
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
