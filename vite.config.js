import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
    server:{
      port:3000,
      host:true,
      proxy: {
        // APIリクエストのパスを指定
        '/api': {
          target: 'http://127.0.0.1:5001', // Node.jsサーバーのアドレス
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
    },
  },
});
