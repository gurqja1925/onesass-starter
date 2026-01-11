import { defineConfig } from 'tsup';

export default defineConfig([
  // CLI 빌드
  {
    entry: {
      cli: 'cli/cli.ts',
    },
    outDir: 'cli-dist',
    format: ['esm'],
    target: 'es2020',
    dts: false,
    splitting: false,
    sourcemap: false,
    banner: {
      js: '#!/usr/bin/env node',
    },
  },
  // Worker 빌드
  {
    entry: {
      worker: 'cli/worker.ts',
    },
    outDir: 'cli-dist',
    format: ['esm'],
    target: 'es2020',
    dts: false,
    splitting: false,
    sourcemap: false,
  },
]);
