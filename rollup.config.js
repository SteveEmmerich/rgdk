import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import ts from '@wessberg/rollup-plugin-ts';
import pkg from './package.json';

export default [
  {
    input: 'src/index.ts',
    output: {
      name: pkg.name,
      file: pkg.browser,
      format: 'umd',
    },
    plugins: [
      ts(),
      resolve(),
      commonjs()
      
    ],
  },
  {
    input: 'src/main.ts', // New input for the main application
    output: {
      name: 'RGDKMain', // UMD bundle name for the main application
      file: 'dist/main.umd.js', // Output file for the main application
      format: 'umd',
    },
    plugins: [ // Shared plugins configuration
      ts(),
      resolve(),
      commonjs(),
    ],
  },
  {
  input: 'src/index.ts',
  external: Object.keys(pkg.dependencies),
  output: [
    { file: pkg.main, format: 'cjs' },

    { file: pkg.module, format: 'es' }
  ],
  plugins: [ts()],
}
];