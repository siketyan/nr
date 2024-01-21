import typescript from "@rollup/plugin-typescript";

/** @type {import('rollup').RollupOptions} */
const config = {
  input: "src/main.ts",
  output: {
    dir: "dist",
    format: "esm",
    sourcemap: true,
  },
  plugins: [typescript()],
  external: [/^node:.+$/, "@npmcli/package-json", "chalk", "minimist"],
};

// noinspection JSUnusedGlobalSymbols
export default config;
