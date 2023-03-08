import type { InternationalizedLabel } from '@intavia/api-client';

import type { Locale } from '~/config/i18n.config';
import { defaultLocale } from '~/config/i18n.config';

export function getTranslatedLabel(
  labels: InternationalizedLabel | undefined,
  locale: Locale = defaultLocale,
): string {
  // FIXME: this should never happen, but it does because the backend does not always return
  // a label field for events.
  if (labels == null) return 'Unknown';
  return labels[locale] ?? labels.default;
}
