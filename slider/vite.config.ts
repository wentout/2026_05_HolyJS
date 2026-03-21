import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import commonjs from '@rollup/plugin-commonjs'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/2026_05_HolyJS/',
  server: {
    port: 3030,
    strictPort: true
  },
  preview: {
    port: 8080,
    strictPort: true
  },
  build: {
    cssMinify: false,
    outDir: '../docs',
    emptyOutDir: true,
    chunkSizeWarningLimit: 2048,
    rollupOptions: {
      plugins: [
        // Handle CommonJS modules properly
        commonjs({
          transformMixedEsModules: true,
          include: [/mnemonica/]
        })
      ],
      onwarn(warning, warn) {
        // Suppress eval warning for exampleRunner.ts
        if (warning.code === 'EVAL' && warning.id?.includes('exampleRunner.ts')) {
          return;
        }
        warn(warning);
      }
    }
  },
  resolve: {
    alias: {
      // Use mnemonica CommonJS build directly
      'mnemonica': '/code/mnemonica/core/build/index.js'
    },
    preserveSymlinks: false
  },
  optimizeDeps: {
    include: ['mnemonica'],
    esbuildOptions: {
      mainFields: ['main', 'module']
    }
  },
  plugins: [
    react(),
  ],
})
