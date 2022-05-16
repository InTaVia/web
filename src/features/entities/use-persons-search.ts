import { sanitizePersonsSearchParams } from '@/features/entities/sanitize-persons-search-params';
import { useSearch } from '@/features/entities/use-search';

export function usePersonsSearch() {
  const { getSearchParams, search } = useSearch(sanitizePersonsSearchParams);

  return { getSearchParams, search };
}
