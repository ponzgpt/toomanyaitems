import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Project pages are served from /<repo>/. Drop this to '/' behind a custom domain.
  base: process.env.BASE_PATH ?? '/toomanyaitems/',
  plugins: [react()],
});
