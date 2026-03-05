import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'pd-markdown-parser': resolve(__dirname, '../../packages/parser/src/index.ts'),
      'pd-markdown-utils': resolve(__dirname, '../../packages/utils/src/index.ts'),
      'pd-markdown-web': resolve(__dirname, '../../packages/web/src/index.ts'),
      'pd-markdown/parser': resolve(__dirname, '../../packages/parser/src/index.ts'),
      'pd-markdown/utils': resolve(__dirname, '../../packages/utils/src/index.ts'),
      'pd-markdown/web': resolve(__dirname, '../../packages/web/src/index.ts'),
    },
  },
})
