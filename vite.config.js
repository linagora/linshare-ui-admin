import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  base: './',
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      { find: /^~/, replacement: '' },
    ],
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: '@import "@/core/styles/main.less";',
        javascriptEnabled: true,
      },
    },
  },
  server: {
    port: 20082,
    proxy: {
      '^/linshare': {
        target: process.env.BACKEND_API_URL || 'http://localhost:28080',
        changeOrigin: true,
      },
    },
  },
});
