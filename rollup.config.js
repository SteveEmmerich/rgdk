import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
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
      resolve(),
      commonjs(),
      typescript()
    ],
  },
  {
  input: 'src/index.ts',
  external: Object.keys(pkg.dependencies),
  output: [
    { file: pkg.main, format: 'cjs' },

    { file: pkg.module, format: 'es' }
  ],
  plugins: [typescript()],
}
];