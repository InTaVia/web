import { LoadingIndicator } from '@intavia/ui';

import { useSearchEntityTypeStatisticsQuery } from '@/api/intavia.service';
import { BarChart } from '@/components/search/overview/bar-chart';
import { useSearchEntitiesFilters } from '@/components/search/use-search-entities-filters';
import type { EntityKindConstraint } from '@/features/visual-querying/constraints.types';

interface EntityTypeConstraintWidgetProps {
  constraint: EntityKindConstraint;
}

export function EntityTypeConstraintWidget(props: EntityTypeConstraintWidgetProps): JSX.Element {
  const { constraint } = props;

  const searchEntitiesFilters = useSearchEntitiesFilters();
  const entityTypeQuery = useSearchEntityTypeStatisticsQuery({
    ...searchEntitiesFilters,
    kind: undefined,
  });
  const isFetching = entityTypeQuery.isFetching;

  if (isFetching) {
    return <LoadingIndicator />;
  }

  if (entityTypeQuery.data === undefined) {
    return <p>Nothing found</p>;
  }

  return <BarChart kind={'entity-type'} data={entityTypeQuery.data} constraint={constraint} />;
}
