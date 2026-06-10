import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    globals: true,
    deps: {
      optimizer: {
        web: {
          enabled: true,
        },
      },
    },
  },
  build: {
    minify: true,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'vendor-core',
              test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom|@reduxjs|react-redux)[\\/]/,
            },
            {
              name: 'vendor-motion',
              test: /[\\/]node_modules[\\/].*motion.*/,
            },
            {
              name: 'vendor-date',
              test: /[\\/]node_modules[\\/](date-fns)[\\/]/,
            },
            {
              name: 'vendor-aria',
              test: /[\\/]node_modules[\\/](@react-aria|react-aria)[\\/]/,
            },
            {
              name: 'vendor-utils',
              test: /[\\/]node_modules[\\/]/,
            },
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
