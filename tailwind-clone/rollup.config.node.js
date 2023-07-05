import typescript from "rollup-plugin-typescript2";

export default {
  input: "main.ts", // Replace with the entry point of your project
  output: {
    file: "dist/bundle.node.js", // Replace with the desired output file and path
    format: "cjs", // Replace with the desired module format (e.g., cjs, umd, esm)
    sourcemap: true,
  },
  plugins: [
    typescript(), // Add the Rollup plugin for TypeScript
  ],
  external: [], // List any external dependencies to exclude from the bundle
};
