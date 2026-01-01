import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default [
  {
    input: 'src/index.ts',
    output: {
      name: pkg.name,
      file: pkg.browser,
      format: 'umd',
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationMap: false,
        outDir: 'dist/core',
      }),
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
  plugins: [typescript({
    tsconfig: './tsconfig.json',
    declaration: true,
    declarationMap: false,
    outDir: 'dist/core',
  })],
}
];