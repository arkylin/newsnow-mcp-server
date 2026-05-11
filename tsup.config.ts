import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs"],
  target: "node18",
  clean: true,
  sourcemap: false,
  dts: false,
  splitting: false,
  minify: false,
  shims: true,
  treeshake: true,
  noExternal: ["fastmcp", "zod", "ofetch", "dotenv"],
  external: ["effect", "@valibot/to-json-schema"],
  outDir: "dist",
  outExtension: () => ({ js: ".cjs" }),
})
