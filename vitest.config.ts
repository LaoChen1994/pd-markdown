import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@pd-markdown/utils': resolve(__dirname, 'packages/utils/src/index.ts'),
      '@pd-markdown/parser': resolve(__dirname, 'packages/parser/src/index.ts'),
      '@pd-markdown/web': resolve(__dirname, 'packages/web/src/index.ts'),
    },
  },
  test: {
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['packages/**/__tests__/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['packages/*/src/**/*.{ts,tsx}'],
      exclude: ['**/types/**', '**/*.d.ts'],
    },
    environmentMatchGlobs: [
      ['packages/web/**', 'jsdom'],
      ['packages/utils/**', 'node'],
      ['packages/parser/**', 'node'],
    ],
  },
})
