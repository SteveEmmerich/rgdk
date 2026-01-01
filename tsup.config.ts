import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm', 'iife'],
  dts: true,
  outDir: 'dist/core',
  splitting: false,
  sourcemap: false,
  clean: false, // We clean manually in the build script
  external: ['rxjs', 'immer', 'rxjs/operators'],
  globalName: 'rgdk',
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.js' : format === 'esm' ? '.mjs' : '.global.js'
    }
  },
})
