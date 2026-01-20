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
  },
  build: {
    chunkSizeWarningLimit: 600, // Slightly raise limit since we're close
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Core React
          if (id.includes('node_modules/react-dom')) {
            return 'vendor-react-dom';
          }
          if (id.includes('node_modules/react-router')) {
            return 'vendor-router';
          }
          if (id.includes('node_modules/react/') || id.includes('node_modules/scheduler')) {
            return 'vendor-react-core';
          }

          // Animation
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion';
          }

          // DnD
          if (id.includes('node_modules/@dnd-kit') || id.includes('node_modules/@hello-pangea')) {
            return 'vendor-dnd';
          }

          // Radix UI
          if (id.includes('node_modules/@radix-ui')) {
            return 'vendor-radix';
          }

          // Export - split into smaller chunks
          if (id.includes('node_modules/docx')) {
            return 'feature-docx';
          }
          if (id.includes('node_modules/html2canvas')) {
            return 'feature-canvas';
          }
          if (id.includes('node_modules/dompurify')) {
            return 'vendor-purify';
          }

          // Supabase
          if (id.includes('node_modules/@supabase')) {
            return 'vendor-supabase';
          }

          // Other large vendors
          if (id.includes('node_modules/zod')) {
            return 'vendor-zod';
          }
          if (id.includes('node_modules/date-fns')) {
            return 'vendor-date';
          }
          if (id.includes('node_modules/clsx') || id.includes('node_modules/tailwind-merge')) {
            return 'vendor-utils';
          }
        }
      }
    }
  }
}));
