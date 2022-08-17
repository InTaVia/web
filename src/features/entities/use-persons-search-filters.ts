import { useSearchParams } from '@/app/route/use-search-params';

export interface PersonsSearchFilters {
  page: number;
  q: string;
  dateOfBirthStart?: number;
  dateOfBirthEnd?: number;
  dateOfDeathStart?: number;
  dateOfDeathEnd?: number;
  professions?: Array<string>;
}

export function usePersonsSearchFilters(): PersonsSearchFilters {
  const searchParams = useSearchParams();

  const page = Math.max(Number(searchParams?.get('page') ?? 1), 1);
  const q = searchParams?.get('q') ?? '';
  const dateOfBirthStart =
    searchParams?.get('dateOfBirthStart') != null
      ? Number(searchParams.get('dateOfBirthStart') ?? '1')
      : undefined;
  const dateOfBirthEnd =
    searchParams?.get('dateOfBirthEnd') != null
      ? Number(searchParams.get('dateOfBirthEnd') ?? '9999')
      : undefined;
  const dateOfDeathStart =
    searchParams?.get('dateOfDeathStart') != null
      ? Number(searchParams.get('dateOfDeathStart') ?? '1')
      : undefined;
  const dateOfDeathEnd =
    searchParams?.get('dateOfDeathEnd') != null
      ? Number(searchParams.get('dateOfDeathEnd') ?? '9999')
      : undefined;
  const professions = searchParams?.getAll('professions');

  return {
    page,
    q,
    dateOfBirthStart,
    dateOfBirthEnd,
    dateOfDeathStart,
    dateOfDeathEnd,
    professions,
  };
}
