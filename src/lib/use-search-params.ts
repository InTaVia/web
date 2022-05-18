import { useRouter } from 'next/router';

import { useRoute } from '@/lib/use-route';

export function useSearchParams(): URLSearchParams | null {
  const router = useRouter();
  const route = useRoute();

  if (!router.isReady) return null;

  return route.searchParams;
}
