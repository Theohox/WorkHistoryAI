import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/WorkHistoryAI/',
  plugins: [
    react({
      babel: {
        presets: ['@babel/preset-react'],
        plugins: [],
      },
      jsx: 'react',
    }),
  ],
  server: {
    proxy: {
      '/api/openai': {
        target: 'https://api.openai.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/openai/, ''),
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': '/src',
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: '/index.html',
      },
      output: {
        manualChunks: undefined,
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  esbuild: {
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
});