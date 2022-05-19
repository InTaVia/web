import { useGetPersonsQuery } from '@/features/common/intavia-api.service';
import { usePersonsSearchFilters } from '@/features/entities/use-persons-search-filters';

export function usePersonsSearchResults() {
  const searchFilters = usePersonsSearchFilters();
  const searchResults = useGetPersonsQuery(searchFilters);

  return searchResults;
}
