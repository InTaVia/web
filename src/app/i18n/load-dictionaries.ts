import type { Dictionaries } from '@/app/i18n/dictionaries';
import type { Locale } from '~/config/i18n.config';
import { defaultLocale } from '~/config/i18n.config';

export async function loadDictionaries<K extends keyof Dictionaries>(
  locale: Locale = defaultLocale,
  namespaces: Array<K>,
): Promise<Pick<Dictionaries, K>> {
  const translations = await Promise.all(
    namespaces.map(async (namespace) => {
      switch (namespace) {
        case 'common':
          switch (locale) {
            default:
              return [
                namespace,
                await import('@/app/i18n/common/en').then((module) => {
                  return module.dictionary;
                }),
              ] as const;
          }
        default:
          throw new Error('Unknown dictionary.');
      }
    }),
  );

  return Object.fromEntries(translations) as Pick<Dictionaries, K>;
}
