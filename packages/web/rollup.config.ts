import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import dts from 'rollup-plugin-dts'
import { defineConfig } from 'rollup'

export default defineConfig([
  // JS bundle
  {
    input: {
      index: 'src/index.ts',
      server: 'src/server.ts',
      client: 'src/client.ts',
    },
    output: [
      {
        dir: 'dist',
        format: 'esm',
        sourcemap: true,
        entryFileNames: '[name].mjs',
        chunkFileNames: 'chunks/[name]-[hash].mjs',
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
      {
        dir: 'dist',
        format: 'cjs',
        sourcemap: true,
        entryFileNames: '[name].cjs',
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: './dist/types',
        outDir: './dist',
      }),
    ],
    external: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'pd-markdown-utils',
      'pd-markdown-parser',
    ],
  },
  // Type declarations bundle
  {
    input: 'dist/types/index.d.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'esm',
    },
    plugins: [dts()],
    external: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'pd-markdown-utils',
      'pd-markdown-parser',
      'mdast',
    ],
  },
])
