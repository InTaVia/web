import { useGetPersonsQuery } from '@/features/common/intavia-api.service';
import { usePersonsSearchFilters } from '@/features/search/usePersonsSearchFilters';

export function usePersonsSearchResults() {
  const searchFilters = usePersonsSearchFilters();
  const searchResults = useGetPersonsQuery(searchFilters);

  return searchResults;
}
