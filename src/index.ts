import type { FlatLocales, GetMessageArgs } from './utils';
import { getMessageByPath } from './utils';

export type MessageFunction = (...args: any[]) => string;

export interface LocaleSchema {
  [key: string]: string | MessageFunction | LocaleSchema;
}

export interface Locales<S extends LocaleSchema> {
  [key: string]: (() => Promise<S>) | S;
}

interface I18nOptions<S extends LocaleSchema, L extends Locales<S> = Locales<S>> {
  locale: keyof L & string;
  locales: L;
  fallbackLocales?: Partial<Record<keyof L, (keyof L & string)[]>>;
  store?: Map<keyof L, S>;
  onMissingKey?: (key: string, locale: keyof L) => string | void;
  onLocaleChanged?: (locale: keyof L) => void;
  onLocaleLoaded?: (locale: keyof L, messages: S) => void;
  onLocaleLoadFailed?: (locale: keyof L, error: any) => void;
}

export function createI18n<
  const S extends LocaleSchema,
  const L extends Locales<S> = Locales<S>,
>(options: I18nOptions<S, L>) {
  const {
    store = new Map<keyof L, LocaleSchema>(),
    locales,
    fallbackLocales,
    onMissingKey = (key, locale: string) => console.warn(`Key "${key}" not found in "${locale}" locale and their fallbacks`),
    onLocaleLoadFailed = (locale: string, error) => console.error(`Failed load locale ${locale}`, error),
  } = options;

  let currentLocale = options.locale;

  const pending = new Map<keyof L, { promise: Promise<LocaleSchema>; background: boolean }>();
  async function fetchLocale(locale: keyof L & string, background = false): Promise<LocaleSchema | void> {
    if (!(locale in options.locales)) {
      return console.error(`Locale "${locale}" not found in provided locales.`);
    }

    const existed = store.get(locale) ?? pending.get(locale)?.promise;
    if (existed) return existed;

    const loaderOrMessages = locales[locale]!;

    if (typeof loaderOrMessages === 'function') {
      try {
        const promise = loaderOrMessages();
        pending.set(locale, { promise, background });
        const messages = await promise;
        store.set(locale, messages);
        pending.delete(locale);
        options.onLocaleLoaded?.(locale, messages);
        return messages;
      }
      catch (error) {
        return onLocaleLoadFailed(locale, error);
      }
    }

    store.set(locale, loaderOrMessages);
    return loaderOrMessages;
  }

  async function setLocale(locale: keyof L & string) {
    if (await fetchLocale(locale)) {
      currentLocale = locale;
      options.onLocaleChanged?.(locale);
      // ? Load fallback locales in background
      if (fallbackLocales && locale in fallbackLocales) {
        fallbackLocales[locale]!.forEach(l => fetchLocale(l, true));
      }
    }
  }

  function t<K extends keyof FlatLocales<L>>(key: K & string, ...args: GetMessageArgs<FlatLocales<L>[K]>) {
    const messages = store.get(currentLocale) ?? {};

    let message = getMessageByPath(messages, key);

    // ? Find message in fallbacks
    if (message === null && fallbackLocales && currentLocale in fallbackLocales) {
      for (const fallbackLocale of fallbackLocales[currentLocale]!) {
        const fallbackMessages = store.get(fallbackLocale);
        if (!fallbackMessages) continue;
        message = getMessageByPath(fallbackMessages, key);
        if (message !== null) break;
      }
    }

    if (message === null) return onMissingKey(key, currentLocale) ?? key;
    if (typeof message === 'function') return message(...args);

    return message;
  }

  // ? Run loading main locale
  setLocale(currentLocale);

  return {
    currentLocale,
    isReady: () => Promise.all(Array.from(pending.values()).filter(l => !l.background)),
    fetchLocale,
    setLocale,
    t,
  };
}
