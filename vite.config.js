import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  base: '/Github-Username-Search/',
  build: { outDir: 'build' },
  test: { environment: 'jsdom', setupFiles: './src/setupTests.js' },
});
