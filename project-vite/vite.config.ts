import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'firebase/app', 'firebase/auth'],
    exclude: ['framer-motion'],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    port: 3000,
    host: true,
  },
});

