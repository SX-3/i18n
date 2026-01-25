import { expect, it } from 'bun:test';
import { createI18n } from '../src/index';

const locales = {
  ru: {
    hello: 'Привет мир!',
    person: (count: number) => count > 1 ? 'Люди' : 'Человек',
    kuba: 'dasd',
  },

  en: () => Promise.resolve({
    hello: 'Hello world!',
    english: 'English!',
    person: (count: number) => count > 1 ? 'Persons' : 'Person',
  }),

  other: () => Promise.resolve({
    hello: 'नमस्कार विश्व !',
  }),
};

const store = new Map();
const { t, setLocale } = createI18n({
  locale: 'ru',
  locales,
  store,
  fallbackLocales: { ru: ['en'] },
  onMissingKey: () => 'UNKNOWN KEY',
});

it('message correct output', () => {
  expect(t('hello')).toBe('Привет мир!');
  expect(t('english'), 'Fallback don\'t work').toBe('English!');
});

it('locale switching', async () => {
  expect(t('hello')).toBe('Привет мир!');
  await setLocale('other');
  expect(t('hello'), 'Locale don\' switch').toBe('नमस्कार विश्व !');
  await setLocale('ru');
});

it('message functions', () => {
  expect(t('person', 1)).toBe('Человек');
  expect(t('person', 2)).toBe('Люди');
});

it('missing key rewrite', () => {
  // @ts-expect-error test missing key
  expect(t('unknown')).toBe('UNKNOWN KEY');
});
