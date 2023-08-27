import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { checker } from 'vite-plugin-checker'
import tsconfigPaths from 'vite-tsconfig-paths'
import dts from 'vite-plugin-dts'

import path from "path";
const fileName = {
  es: `index.es.js`,
  cjs: `index.cjs.js`,
};

const formats = Object.keys(fileName) as Array<keyof typeof fileName>;


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    checker({
      typescript: true,
      enableBuild: true
    }),
    dts({
      outDir: './dist/typings'
    })
  ],
  base: "./",
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "render",
      formats,
      fileName: (format) => fileName[format as keyof typeof fileName],
    },
  }
})
