import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  build: {
    target: 'esnext',
  },
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
  },
  css: {
    // https://vite.dev/config/shared-options#css-preprocessoroptions
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler', // or "modern"
      },
    },
    modules: {
      localsConvention: 'camelCase',
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@assets': resolve(__dirname, '/assets'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@services': resolve(__dirname, 'src/services'),
      '@features': resolve(__dirname, 'src/features'),
      '@store': resolve(__dirname, 'src/store'),
      '@config': resolve(__dirname, 'src/config'),
      '@interfaces': resolve(__dirname, 'src/interfaces'),
      '@constants': resolve(__dirname, 'src/constants'),
      '@layouts': resolve(__dirname, 'src/layouts'),
      '@routes': resolve(__dirname, 'src/routes'),
      '@generated-types': resolve(__dirname, 'src/generated-types'),
      '@contexts': resolve(__dirname, 'src/contexts'),
      src: resolve(__dirname, './src'),
    },
  },
});
