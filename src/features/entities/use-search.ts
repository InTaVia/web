import type { UrlSearchParamsInit } from '@stefanprobst/request';
import { createUrlSearchParams } from '@stefanprobst/request';
import { useRouter } from 'next/router';

interface UseSearchResult<T extends UrlSearchParamsInit> {
  getSearchParams: (searchParams: T) => string;
  search: (searchParams: T) => void;
}

export function useSearch<T extends UrlSearchParamsInit>(
  sanitizeSearchParams?: (searchParams: T) => T,
): UseSearchResult<T> {
  const router = useRouter();

  function getSearchParams(searchParams: T): string {
    const sanitizedSearchParams =
      sanitizeSearchParams != null ? sanitizeSearchParams(searchParams) : searchParams;
    return String(createUrlSearchParams(sanitizedSearchParams));
  }

  function search(searchParams: T): void {
    void router.push({ query: getSearchParams(searchParams) });
  }

  return { getSearchParams, search };
}
