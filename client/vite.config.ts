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
      'stream/promises': path.resolve(__dirname, 'src/shims/stream-promises.ts'),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': 'https://onepuzzle-2.onrender.com',
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
