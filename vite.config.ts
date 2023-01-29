import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import dotenv from 'dotenv'
import topLevelAwait from 'vite-plugin-top-level-await';
import * as path from 'path';

dotenv.config()

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    assetsInclude: ['**/*.png'],
    server: {
      port: 3000,
    },
    define: {
      __CHATS_LS__: JSON.stringify(process.env.VITE_CHATS_LS.trim()),
      __USER_SS__: JSON.stringify(process.env.VITE_USER_SS.trim()),
      __USERS_LS__: JSON.stringify(process.env.VITE_USERS_LS.trim()),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    plugins: [react(), topLevelAwait(), wasm()],
    build: {
      manifest: false,
      minify: mode === 'development' ? false : 'terser',
      sourcemap: command === 'serve' ? 'inline' : false,
    },

    optimizeDeps: {
      exclude: ['@automerge/automerge-wasm'],
    },
  };
});
