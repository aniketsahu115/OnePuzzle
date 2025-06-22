import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
      'stream/promises': path.resolve(__dirname, 'client/src/shims/stream-promises.ts'),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': 'http://localhost:4001',
    },
  },
  optimizeDeps: {
    include: [
      '@solana/web3.js',
      '@metaplex-foundation/js',
      '@metaplex-foundation/mpl-token-metadata',
      'buffer'
    ],
  },
  define: {
    'global': 'window',
  }
});
