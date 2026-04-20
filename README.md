[![npm](https://img.shields.io/npm/v/@sx3/i18n)](https://www.npmjs.com/package/@sx3/i18n)

# I18n

Flexible localization system like a [Fluent](https://projectfluent.org/) but for TypeScript.

## Features

- Small ~630 bytes gzip
- Support message functions (for pluralization or for any functions)
- [Native](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) pluralization
- Dependency free
- Type safe (for keys and message functions)
- Simple lazy loading

## Install

```bash
bun add @sx3/i18n
```

## Usage

```ts
import { createI18n } from '@sx3/i18n';
import { pluralize } from '@sx3/i18n/plural';

// Better to define in the localization file.
const EN_RULES = new Intl.PluralRules('en-US');

const { t } = createI18n({
  locale: 'en',
  locales: {
    en: {
      // Static string message
      me: 'SX3',
      // Functional messages
      hello: (who: string) => `Hello ${who}!`,
      user: {
        liked: (who: string, what: string) => `${who} liked the ${what}`
      },
      // Pluralization with Intl.PluralRules
      apple: pluralize({ one: 'apple', other: count => `${count} apples` }, EN_RULES)

    },

    // Lazy loading locale
    ru: () => import('./lang/ru').then(m => m.default)
  },

  // Fallbacks loads in background
  fallbackLocales: { en: ['ru'] },

  // Handle missing keys
  onMissingKey: (key, locale) => {
    console.warn(`Key "${key}" not found in "${locale}" locale and their fallbacks`);
    // You can rewrite message for missing keys
    return 'Unknown key';
  }
});

t('hello', 'world'); // -> Hello world
t('non-existent'); // -> TypeScript error for non existent key
t('apple'); // -> TypeScript error need count argument specified
t('apple', 1); // -> apple
t('apple', 3); // -> 3 apples
t('user.liked', 'SX3', 'post'); // -> SX3 liked the post
```
