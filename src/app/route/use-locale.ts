import { useRouter } from 'next/router';

import type { Locale, Locales } from '~/config/i18n.config';

interface UseLocaleResult {
  defaultLocale: Locale;
  locale: Locale;
  locales: Locales;
}

export function useLocale(): UseLocaleResult {
  const { defaultLocale, locale, locales } = useRouter();

  return { defaultLocale, locale, locales } as unknown as UseLocaleResult;
}
