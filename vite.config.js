import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/bundle-report.html',
      open: true, // Opens the report in your browser after build
    }),
  ],
  optimizeDeps: {
    include: [
      'hoist-non-react-statics',
    ],
  },
  server: {
    proxy: {
      // Any request starting with /api will be forwarded
      "/api": {
        target: "https://swyft-agent-01.vercel.app",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
