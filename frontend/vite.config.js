import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: "/-sppu-ai-papers/",

  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "pdfjs-dist": path.resolve(
        __dirname,
        "node_modules/pdfjs-dist/legacy/build/pdf.mjs"
      ),
    },
  },
});
