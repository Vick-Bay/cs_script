import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
      },
    },
  },
  resolve: {
    alias: {
      "@": dirname(__filename) + "/src",
    },
  },
});
