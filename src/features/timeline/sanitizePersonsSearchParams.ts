import type { PersonsSearchFilters } from '@/features/search/usePersonsSearchFilters';

export function sanitizePersonsSearchParams(
  searchParams: Partial<PersonsSearchFilters>,
): Partial<PersonsSearchFilters> {
  const sanitizedSearchParams = { ...searchParams };

  if (typeof sanitizedSearchParams.page === 'number' && sanitizedSearchParams.page <= 1) {
    delete sanitizedSearchParams.page;
  }

  if (typeof sanitizedSearchParams.q === 'string' && sanitizedSearchParams.q.trim().length === 0) {
    delete sanitizedSearchParams.q;
  }

  return sanitizedSearchParams;
}
