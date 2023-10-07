import * as Path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import viteCompression from 'vite-plugin-compression'

const fileName = {
  es: `index.es.js`,
  cjs: `index.cjs.js`,
};

const formats = Object.keys(fileName) as Array<keyof typeof fileName>;

export default defineConfig({
  base: "./",
  build: {
    lib: {
      entry: Path.resolve(__dirname, "src/index.ts"),
      formats,
      fileName: (format: string) => fileName[format as keyof typeof fileName],
    },
    minify: "esbuild",
    sourcemap: true,
  },
  plugins: [
    dts({
      outDir: "./dist",
    }),
    viteCompression()
  ],
});
