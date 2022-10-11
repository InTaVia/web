import { useMemo } from 'react';

import type { SearchEntities } from '@/api/intavia.client';
import { isEntityKind } from '@/api/intavia.models';
import { useSearchParams } from '@/app/route/use-search-params';
import { getSearchParam } from '@/lib/get-search-param';
import { getSearchParams } from '@/lib/get-search-params';
import { toPositiveInteger } from '@/lib/to-positive-integer';
import { defaultPageSize } from '~/config/intavia.config';

export function useSearchEntitiesFilters(): SearchEntities.SearchParams {
  const { searchParams } = useSearchParams();

  const searchEntitiesFilters = useMemo(() => {
    const defaults = {
      page: 1,
      limit: defaultPageSize,
      includeEvents: true,
    };

    if (searchParams == null) return defaults;

    const searchEntitiesFilters = {
      page: toPositiveInteger(Number(getSearchParam(searchParams, 'page') ?? 1)) ?? defaults.page,
      q: getSearchParam(searchParams, 'q'),
      limit: toPositiveInteger(Number(getSearchParam(searchParams, 'limit') ?? defaults.limit)),
      kind: getSearchParams(searchParams, 'kind').filter(isEntityKind),
      includeEvents: getSearchParam(searchParams, 'includeEvents')?.toLowerCase() !== 'false',
      occupation: getSearchParam(searchParams, 'occupation'),
      occupations_id: getSearchParams(searchParams, 'occupations_id'),
      gender: getSearchParam(searchParams, 'gender'),
      gender_id: getSearchParam(searchParams, 'gender_id'),
      bornBefore: getSearchParam(searchParams, 'bornBefore'),
      bornAfter: getSearchParam(searchParams, 'bornAfter'),
      diedBefore: getSearchParam(searchParams, 'diedBefore'),
      diedAfter: getSearchParam(searchParams, 'diedAfter'),
    };

    return searchEntitiesFilters;
  }, [searchParams]);

  return searchEntitiesFilters;
}
