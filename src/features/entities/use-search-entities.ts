import type { SearchEntities } from '@intavia/api-client';

import * as routes from '@/app/route/routes';
import { sanitizeSearchEntitiesParams } from '@/features/entities/sanitize-search-entities-params';
import type { UseSearchResult } from '@/features/entities/use-search';
import { useSearch } from '@/features/entities/use-search';

export function useSearchEntities(): UseSearchResult<SearchEntities.SearchParams> {
  const { getSearchUrl, search } = useSearch(
    routes.search().pathname,
    sanitizeSearchEntitiesParams,
  );

  return { getSearchUrl, search };
}
