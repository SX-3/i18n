import { defineConfig } from 'tsdown';

export default defineConfig({
  exports: false,
  entry: ['./src/index.ts', './src/plural.ts'],
  minify: true,
  // ...config options
});
