import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'hoist-non-react-statics', // This is okay if needed
    ],
    // Removed the exclude block
  },
});
