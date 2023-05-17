import typescript from '@rollup/plugin-typescript';
import type { RollupOptions } from 'rollup';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json',
      compilerOptions: {
        rootDir: 'src',
      },
      exclude: ['**/node_modules/**', '**/__test__/**', 'dist'],
    }),
  ],
} satisfies RollupOptions;
