import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      strict: false
    }
  },
  plugins: [
    react({
      babel: {
        plugins: [
          ["@babel/plugin-proposal-decorators", { "legacy": true }]
        ]
      }
    }),
    tsconfigPaths({
      loose: true
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['@hello-pangea/dnd', '@radix-ui/react-separator']
  }
}));
