import { useSearchOccupationStatisticsQuery } from '@/api/intavia.service';
import { useSearchEntitiesFilters } from '@/components/search/use-search-entities-filters';
import type { PersonOccupationConstraint } from '@/features/visual-querying/constraints.types';
import { VocabularyConstraintWidget } from '@/features/visual-querying/VocabularyConstraintWidget';

interface ProfessionConstraintWidgetProps {
  constraint: PersonOccupationConstraint;
}

export function ProfessionConstraintWidget(props: ProfessionConstraintWidgetProps): JSX.Element {
  const { constraint } = props;

  const searchFilters = useSearchEntitiesFilters();
  const { data, isLoading } = useSearchOccupationStatisticsQuery(searchFilters);

  return (
    <VocabularyConstraintWidget constraint={constraint} data={data?.tree} isLoading={isLoading} />
  );
}
