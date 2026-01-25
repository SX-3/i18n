import antfu from '@antfu/eslint-config';

export default antfu({
  formatters: true,
  typescript: true,
  stylistic: {
    semi: true,
  },
  rules: {
    'antfu/if-newline': ['off'],
  },
});
