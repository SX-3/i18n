[![npm](https://img.shields.io/npm/v/@sx3/i18n)](https://www.npmjs.com/package/@sx3/i18n)

# I18n

## Features

- Small ~630 bytes gzip
- Support message functions (for pluralization or other features)
- Dependency free
- Type safe (for keys and message functions)
- Simple lazy loading

## Install

```bash
bun add @sx3/ultra
```

## Usage

```ts
import { createI18n } from '@sx3/i18n';

const i18n = createI18n({
  locale: 'en',
  locales: {
    en: {
      hello: 'Hello world',
      // Functions handling | simplified for example
      apple: (count: number) => count > 1 ? `${count} apples` : 'apple'
    },
    // Lazy loading
    other: () => import('./lang/other').then(m => m.default)
  },

  // Fallbacks
  fallbackLocales: { en: ['other'] },

  // Handle missing keys
  onMissingKey: (key, locale) => {
    console.warn(`Key "${key}" not found in "${locale}" locale and their fallbacks`);
    // You can rewrite message for missing keys
    return 'Unknown key';
  }
});

i18n.t('hello'); // -> Hello world
i18n.t('non-existent'); // -> TypeScript error for non existent keys
i18n.t('apple'); // -> TypeScript error need count argument specified
```

## Usage with reactivity (Vue example)

```ts
import { createI18n } from '@sx3/i18n';
import { createApp, shallowReactive } from 'vue';

// Now store is reactive
const store = shallowReactive(new Map());
const i18n = createI18n({
  locale: 'en',
  store,
  // ...other options
});

// Wait when main locale loaded
await i18n.isReady();

const app = createApp(App).mount('#app');
```
