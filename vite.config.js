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
});
