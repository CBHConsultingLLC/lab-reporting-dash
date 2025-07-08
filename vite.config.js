import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  build: {
    base: '/lab-reporting-dash/',
    outDir: 'dist',
    assetsDir: 'assets',
    minify: false, // Disable minification to avoid terser dependency
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  optimizeDeps: {
    exclude: ['jquery', 'bootstrap', 'luxon', 'xlsx', 'exceljs', 'tabulator']
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
}) 