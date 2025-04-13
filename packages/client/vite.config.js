import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslintPlugin from 'vite-plugin-eslint';
import { resolve } from 'path';
import checker from 'vite-plugin-checker';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    eslintPlugin({
      cache: false,
    }),
    checker({
      vueTsc: true,
    }),
  ],
});
