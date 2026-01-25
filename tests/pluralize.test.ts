import { expect, it } from 'bun:test';
import { createI18n } from '../src';
import { pluralize } from '../src/plural';

const rules = new Intl.PluralRules('en');

const { t } = createI18n({
  locale: 'en',
  locales: {
    en: {
      apple: pluralize({ one: 'apple', other: count => `${count} apples` }, rules),
    } as const,
  },
});

it('pluralize values', () => {
  expect(t('apple', 1)).toBe('apple');
  expect(t('apple', 3)).toBe('3 apples');
});
