import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/tanstack/vite";

export default defineConfig({
  nitro: {
    preset: "vercel",
    // Keep the generated Vercel function on the stable Node 22 runtime.
    // Nitro otherwise derives this from the Node version used by the builder.
    vercel: {
      functions: {
        runtime: "nodejs22.x",
      },
    },
  },
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    plugins: [mcpPlugin()],
    server: {
      host: "0.0.0.0",
      port: 3000,
      allowedHosts: ["operations-remedy-congressional-hotels.trycloudflare.com"],
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        onwarn(warning, defaultHandler) {
          if (
            warning.code === "MODULE_LEVEL_DIRECTIVE" ||
            warning.message?.includes("Module level directives cause errors when bundled")
          ) {
            return;
          }
          defaultHandler(warning);
        },
        output: {
          preserveModules: false,
        },
      },
    },
  },
});
