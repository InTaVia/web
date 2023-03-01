import type { SearchEntities } from '@intavia/api-client';

import * as routes from '@/app/route/routes';
import { sanitizeSearchEntitiesParams } from '@/components/search/sanitize-search-entities-params';
import type { UseSearchResult } from '@/components/search/use-search';
import { useSearch } from '@/components/search/use-search';

export function useSearchEntities(): UseSearchResult<SearchEntities.SearchParams> {
  const { getSearchUrl, search } = useSearch(
    routes.search().pathname,
    sanitizeSearchEntitiesParams,
  );

  return { getSearchUrl, search };
}
