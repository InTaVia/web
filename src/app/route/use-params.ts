import { createUrlSearchParams } from '@stefanprobst/request';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

export function useParams(): URLSearchParams | null {
  const router = useRouter();

  const searchParams = useMemo(() => {
    if (!router.isReady) return null;

    /**
     * Using `router.query` instead of the full URL from `useRoute`,
     * to include the dynamic path segments.
     */
    return createUrlSearchParams(router.query);
  }, [router]);

  return searchParams;
}
