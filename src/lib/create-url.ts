import type { UrlSearchParamsInit } from '@/lib/create-url-search-params';
import { createUrlSearchParams } from '@/lib/create-url-search-params';
import { baseUrl as appBaseUrl } from '~/config/app.config';

export interface CreateUrlArgs {
  pathname: string;
  baseUrl?: URL | string;
  searchParams?: UrlSearchParamsInit;
  hash?: string;
}

export function createUrl(args: CreateUrlArgs): URL {
  const { pathname, baseUrl = appBaseUrl, searchParams, hash } = args;

  const url = new URL(pathname, baseUrl);

  if (searchParams != null) {
    createUrlSearchParams({ searchParams, init: url.searchParams });
  }

  if (hash != null) {
    url.hash = hash;
  }

  return url;
}
