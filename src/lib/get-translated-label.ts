import type { InternationalizedLabel } from '@intavia/api-client';

import type { Locale } from '~/config/i18n.config';
import { defaultLocale } from '~/config/i18n.config';

export function getTranslatedLabel(
  labels: InternationalizedLabel,
  locale: Locale = defaultLocale,
): string {
  return labels[locale] ?? labels.default;
}
