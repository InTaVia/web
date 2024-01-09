import type { EntityKind } from '@intavia/api-client';

import { useI18n } from '@/app/i18n/use-i18n';
import type { BarChartKind } from '@/components/search/overview/bar-chart';

export function useChartLabels(kind: BarChartKind, input: Array<string>): Array<string> {
  const { t } = useI18n<'common'>();

  if (kind === 'entity-type') {
    return input.map((d) => {
      return t(['common', 'entity', 'kinds', d as EntityKind, 'other']);
    });
  }

  return input;
}
