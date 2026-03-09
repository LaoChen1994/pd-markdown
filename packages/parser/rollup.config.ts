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
        dir: 'dist',
        format: 'esm',
        sourcemap: true,
        entryFileNames: '[name].mjs',
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
      {
        file: 'dist/index.cjs',
        format: 'cjs',
        sourcemap: true,
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
      'pd-markdown-utils',
      'unified',
      'remark-parse',
      'remark-gfm',
      'remark-frontmatter',
      'unist-util-visit',
      'yaml',
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
      'pd-markdown-utils',
      'unified',
      'remark-parse',
      'remark-gfm',
      'remark-frontmatter',
      'unist-util-visit',
      'yaml',
      'mdast',
      'vfile',
    ],
  },
])
