import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

import { visualizer } from "rollup-plugin-visualizer";

/** @type {import('rollup').RollupOptions} */
const config = {
  input: "src/main.ts",
  output: {
    dir: "dist",
    format: "esm",
    sourcemap: true,
  },
  plugins: [
    terser(),
    typescript(),
    replace({
      preventAssignment: true,
      "process.env.NODE_DEBUG": "'false'",
      "process.env.NODE_ENV": "'production'",
    }),
    visualizer(),
  ],
  external: [/^node:.+$/, "ink", "minimatch", "minimist", "react", "react/jsx-runtime"],
};

// noinspection JSUnusedGlobalSymbols
export default config;
