import type { UrlSearchParamsInit } from '@stefanprobst/request';
import { createUrlSearchParams } from '@stefanprobst/request';
import type { LinkProps } from 'next/link';
import { useRouter } from 'next/router';

export interface UseSearchResult<T extends UrlSearchParamsInit> {
  getSearchUrl: (searchParams: T) => LinkProps['href'];
  search: (searchParams: T) => void;
}

export function useSearch<T extends UrlSearchParamsInit>(
  pathname: string,
  sanitizeSearchParams?: (searchParams: T) => T,
): UseSearchResult<T> {
  const router = useRouter();

  function getSearchUrl(searchParams: T): LinkProps['href'] {
    const sanitizedSearchParams =
      sanitizeSearchParams != null ? sanitizeSearchParams(searchParams) : searchParams;
    return { pathname, query: String(createUrlSearchParams(sanitizedSearchParams)) };
  }

  function search(searchParams: T): void {
    void router.push(getSearchUrl(searchParams));
  }

  return { getSearchUrl, search };
}
