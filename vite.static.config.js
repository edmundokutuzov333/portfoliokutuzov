import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tsconfigPaths(),
    tanstackStart({ client: { entry: "main.tsx" } }),
    react(),
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
  },
});
