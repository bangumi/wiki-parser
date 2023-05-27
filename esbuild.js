import * as fs from 'node:fs';

import * as esbuild from 'esbuild';

fs.rmSync('./dist/', { recursive: true, force: true });

await esbuild.build({
  entryPoints: ['./src/index.ts'],
  outfile: './dist/index.js',
  format: 'esm',
  bundle: true,
  target: 'node16',
  sourcemap: 'external',
});
