import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.', // ana klasör
  build: {
    outDir: 'dist',
  },
});
