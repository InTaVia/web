import type { UrlSearchParamsInit } from '@stefanprobst/request';
import { useMemo } from 'react';

import { useLocale } from '@/app/route/use-locale';
import { usePathname } from '@/app/route/use-pathname';
import { createAppUrl } from '@/lib/create-app-url';
import type { Locale } from '~/config/i18n.config';

type UseAlternateLanguageUrlsResult = Array<{ hrefLang: Locale; href: string }>;

export function useAlternateLanguageUrls(
  searchParams?: UrlSearchParamsInit,
): UseAlternateLanguageUrlsResult {
  const { locales } = useLocale();
  const pathname = usePathname();

  const urls = useMemo(() => {
    return locales.map((locale) => {
      const url = createAppUrl({
        locale,
        pathname,
        searchParams,
        hash: undefined,
      });

      return { hrefLang: locale, href: String(url) };
    });
  }, [locales, pathname, searchParams]);

  return urls;
}
