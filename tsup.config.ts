import { defineConfig } from 'tsup';

/**
 * Clean output folder
 * Build esm version (for: import WebReader from "@nypl/web-reader")
 * Build cjs version (for: const WebReader = require("@nypl/web-reader"))
 * Compile injectable CSS files (is this used?)
 * Generate TS declarations
 */

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['esm', 'cjs'],
  sourcemap: true,
  dts: true,
  target: ['es2016', 'chrome89', 'firefox88', 'safari14', 'edge90'],
  clean: true,
  minify: false,
});
