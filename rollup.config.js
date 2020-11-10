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
  input: 'src/index.ts',
  external: Object.keys(pkg.dependencies),
  output: [
    { file: pkg.main, format: 'cjs' },

    { file: pkg.module, format: 'es' }
  ],
  plugins: [ts()],
}
];