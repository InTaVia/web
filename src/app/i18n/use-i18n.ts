import type { I18nContextValue } from '@stefanprobst/next-i18n';
import { useI18n as useInternationalisation } from '@stefanprobst/next-i18n';

import type { Dictionaries } from '@/app/i18n/dictionaries';
import type { Locale } from '~/config/i18n.config';

export function useI18n<K extends keyof Dictionaries = never>(): I18nContextValue<
  Pick<Dictionaries, K>,
  Locale
> {
  return useInternationalisation<Pick<Dictionaries, K>, Locale>();
}
