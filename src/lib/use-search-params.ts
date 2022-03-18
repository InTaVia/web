import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { createUrlSearchParams } from '@/lib/create-url-search-params';

export function useSearchParams(): URLSearchParams | null {
  const router = useRouter();

  const searchParams = useMemo(() => {
    if (!router.isReady) return null;

    return createUrlSearchParams({ searchParams: router.query });
  }, [router]);

  return searchParams;
}
