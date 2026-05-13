// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    plugins: [
      {
        name: "force-static-build",
        configResolved(config) {
          const plugins = config.plugins as any[];
          // Disable TanStack Start import protection
          const protectionPlugin = plugins.find(p => p.name === 'tanstack-start-core:import-protection');
          if (protectionPlugin) {
            protectionPlugin.apply = () => false;
          }
        }
      }
    ],
    server: {
      allowedHosts: ["operations-remedy-congressional-hotels.trycloudflare.com"],
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          preserveModules: false,
        },
      },
    },
  },
});
