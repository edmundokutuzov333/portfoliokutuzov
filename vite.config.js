import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/tanstack/vite";

export default defineConfig({
  nitro: { preset: "vercel" },
  tanstackStart: { server: { entry: "server" } },
  vite: {
    plugins: [mcpPlugin()],
    server: { host: "0.0.0.0", port: 3000 },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        onwarn(warning, defaultHandler) {
          if (
            warning.code === "MODULE_LEVEL_DIRECTIVE" ||
            warning.message?.includes("Module level directives cause errors when bundled")
          )
            return;
          defaultHandler(warning);
        },
        output: {
          preserveModules: false,
          manualChunks(id) {
            if (id.includes("node_modules/framer-motion")) return "framer-motion";
            if (
              id.includes("node_modules/@tanstack/react-router") ||
              id.includes("node_modules/@tanstack/router-core")
            )
              return "tanstack-router";
            if (
              id.includes("node_modules/@tanstack/react-query") ||
              id.includes("node_modules/@tanstack/query-core")
            )
              return "tanstack-query";
            if (id.includes("node_modules/pdf-lib")) return "pdf-lib";
            if (id.includes("node_modules/@google/genai")) return "google-genai";
            if (id.includes("node_modules/recharts")) return "recharts";
            return undefined;
          },
        },
      },
    },
  },
});
