import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname),
  server: {
    port: 5173,
    open: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src'),
      '@react-gdoc/primitives': resolve(__dirname, './primitives'),
      '@react-gdoc/shortcuts': resolve(__dirname, '../src/components/shortcuts.tsx'),
      '@react-gdoc/headings': resolve(__dirname, '../src/components/headings.tsx'),
      '@react-gdoc/tables': resolve(__dirname, '../src/components/tables.tsx'),
    },
  },
});

