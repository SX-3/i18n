import { defineConfig } from 'tsdown';

export default defineConfig({
  exports: false,
  entry: ['./src/index.ts', './src/plural.ts', './src/utils.ts'],
  minify: true,
  // ...config options
});
