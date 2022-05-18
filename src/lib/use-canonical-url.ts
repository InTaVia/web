import type { UrlSearchParamsInit } from '@stefanprobst/request';
import { useMemo } from 'react';

import { createAppUrl } from '@/lib/create-app-url';
import { usePathname } from '@/lib/use-pathname';

export function useCanonicalUrl(searchParams?: UrlSearchParamsInit): URL {
  const pathname = usePathname();

  const url = useMemo(() => {
    const url = createAppUrl({
      pathname,
      searchParams,
      hash: undefined,
    });

    return url;
  }, [pathname, searchParams]);

  return url;
}
