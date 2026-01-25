import { defineConfig } from 'tsdown';

export default defineConfig({
  exports: false,
  entry: ['./src/index.ts'],
  minify: true,
  // ...config options
});
