import { useSearchEntitiesQuery } from '@/api/intavia.service';
import { useSearchEntitiesFilters } from '@/features/entities/use-search-entities-filters';

export function useSearchEntitiesResults() {
  const searchEntitiesFilters = useSearchEntitiesFilters();
  const query = useSearchEntitiesQuery(searchEntitiesFilters);

  return query;
}
