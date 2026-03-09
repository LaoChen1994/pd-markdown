import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import dts from 'rollup-plugin-dts'
import { defineConfig } from 'rollup'

export default defineConfig([
  // JS bundle
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.mjs',
        format: 'esm',
        sourcemap: true,
        paths: {
          'pd-markdown-utils': 'pd-markdown/utils',
          'pd-markdown-parser': 'pd-markdown/parser',
        },
      },
      {
        file: 'dist/index.cjs',
        format: 'cjs',
        sourcemap: true,
        paths: {
          'pd-markdown-utils': 'pd-markdown/utils',
          'pd-markdown-parser': 'pd-markdown/parser',
        },
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
      paths: {
        'pd-markdown-utils': 'pd-markdown/utils',
        'pd-markdown-parser': 'pd-markdown/parser',
      },
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
