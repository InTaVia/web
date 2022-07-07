import { useSearchParams } from '@/app/route/use-search-params';

export interface PersonsSearchFilters {
  page: number;
  q: string;
}

export function usePersonsSearchFilters(): PersonsSearchFilters {
  const searchParams = useSearchParams();

  const page = Math.max(Number(searchParams?.get('page') ?? 1), 1);
  const q = searchParams?.get('q') ?? '';

  return { page, q };
}
