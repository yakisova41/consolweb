import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

export default [
  {
    input: "src/consolweb/index.ts",
    output: [
      {
        file: "dist/index.js",
        format: "esm",
        sourcemap: false,
      },
    ],
    plugins: [
      commonjs({
        include: ["node_modules/**"],
      }),
      typescript({
        tsconfig: "./tsconfig.json",
        exclude: ["**/__tests__/**"],
      }),
    ],
    external: ["react", "react-dom"],
  },
  {
    input: "src/consolweb/index.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
  },
];
