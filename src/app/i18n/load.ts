import type { Dictionaries } from '@/app/i18n/dictionaries';
import type { Locale } from '~/config/i18n.config';
import { defaultLocale } from '~/config/i18n.config';

export async function load<K extends keyof Dictionaries>(
  locale: Locale = defaultLocale,
  namespaces: Array<K>,
): Promise<Pick<Dictionaries, K>> {
  const translations = await Promise.all(
    namespaces.map(async (namespace) => {
      /**
       * The path must be provided as string literal or template string literal.
       *
       * @see https://webpack.js.org/api/module-methods/#dynamic-expressions-in-import
       */
      const { dictionary } = await import(`@/app/i18n/${namespace}/${locale}.ts`);

      return [namespace, dictionary];
    }),
  );

  return Object.fromEntries(translations);
}
