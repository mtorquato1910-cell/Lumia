import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import { mochaPlugins } from "@getmocha/vite-plugins";

// Desabilita o plugin do Cloudflare no Windows (problema de compatibilidade com Miniflare)
const isWindows = process.platform === "win32";
const skipCloudflare = isWindows || process.env.VITE_NO_CLOUDFLARE === "true";

export default defineConfig({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: [
    ...mochaPlugins(process.env as any),
    react(),
    ...(skipCloudflare ? [] : [cloudflare()]),
  ],
  server: {
    allowedHosts: true,
  },
  build: {
    chunkSizeWarningLimit: 5000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
