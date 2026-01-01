import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm', 'iife'],
  dts: true,
  outDir: 'dist/core',
  splitting: false,
  sourcemap: false, // Disabled for production builds; enable with --sourcemap for debugging
  clean: false, // We clean manually in the build script
  external: ['rxjs', 'immer', 'rxjs/operators'],
  globalName: 'rgdk',
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.js' : format === 'esm' ? '.mjs' : '.global.js'
    }
  },
  // Note: @swc/core is used automatically by tsup for ES5 target downleveling
  // The target is read from tsconfig.json (currently set to ES5)
})
