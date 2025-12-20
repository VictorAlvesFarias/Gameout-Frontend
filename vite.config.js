import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: "/",
  assetsInclude: ['**/*.svg'],
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        environment: resolve(__dirname, 'src/environment.tsx')
      },
      output: {
        entryFileNames: chunk => {
          if (chunk.name === 'environment') {
            return 'assets/environment.js'
          }

          return 'assets/[name]-[hash].js'
        }
      }
    }
  }
})
