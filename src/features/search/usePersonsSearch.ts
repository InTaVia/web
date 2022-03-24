import { sanitizePersonsSearchParams } from '@/features/search/sanitizePersonsSearchParams';
import { useSearch } from '@/features/search/useSearch';

export function usePersonsSearch() {
  const { getSearchParams, search } = useSearch(sanitizePersonsSearchParams);

  return { getSearchParams, search };
}
