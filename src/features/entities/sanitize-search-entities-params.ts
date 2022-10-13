import type { SearchEntities } from '@/api/intavia.client';
import { defaultPageSize } from '~/config/intavia.config';

export function sanitizeSearchEntitiesParams(
  searchParams: Partial<SearchEntities.SearchParams>,
): Partial<SearchEntities.SearchParams> {
  const sanitizedSearchParams = { ...searchParams };

  if (typeof sanitizedSearchParams.page === 'number' && sanitizedSearchParams.page <= 1) {
    delete sanitizedSearchParams.page;
  }

  if (
    typeof sanitizedSearchParams.limit === 'number' &&
    sanitizedSearchParams.limit === defaultPageSize
  ) {
    delete sanitizedSearchParams.limit;
  }

  if (typeof sanitizedSearchParams.q === 'string' && sanitizedSearchParams.q.trim().length === 0) {
    delete sanitizedSearchParams.q;
  }

  return sanitizedSearchParams;
}
