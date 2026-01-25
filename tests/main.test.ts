import { beforeAll, expect, it } from 'bun:test';
import { createI18n } from '../src/index';

const locales = {
  ru: () => import('./lang/ru').then(m => m.default),
  en: () => import('./lang/en').then(m => m.default),
  other: () => Promise.resolve({
    hello: 'नमस्कार विश्व !',
    gumaza: 'cao cao',
  } as const),
};

const store = new Map();
const { t, setLocale, fetchLocale } = createI18n({
  locale: 'ru',
  locales,
  store,
  fallbackLocales: { ru: ['en'] },
  onMissingKey: () => 'UNKNOWN KEY',
});

beforeAll(() => fetchLocale('en'));

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

it('nested message', () => {
  expect(t('user.liked', 'SX3', 'post')).toBe('SX3 liked the post');
});

it('missing key rewrite', () => {
  // @ts-expect-error test missing key
  expect(t('unknown')).toBe('UNKNOWN KEY');
});
