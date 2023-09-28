import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const fileName = {
  es: `index.es.js`,
  cjs: `index.cjs.js`,
  umd: `index.umd.js`,
};

const formats = Object.keys(fileName) as Array<keyof typeof fileName>;

module.exports = defineConfig({
  base: "./",
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "processor",
      formats,
      fileName: (format: string) => fileName[format as keyof typeof fileName],
    },
    sourcemap: true,
  },
  plugins: [
    dts({
      outDir: "./dist",
    }),
  ],
});
