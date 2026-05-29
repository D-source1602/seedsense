import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      // Forward backend API calls to the Express server (server.js) when running both
      '/get-weather': 'http://localhost:4000',
      '/recommend-crops': 'http://localhost:4000',
      '/get-crop-details': 'http://localhost:4000',
      '/get-multiple-crop-details': 'http://localhost:4000',
    },
  },
});
