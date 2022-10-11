import { useEffect, useMemo } from 'react';

import { useSearchParams } from '@/app/route/use-search-params';
import { useAppDispatch } from '@/app/store';
import { clearSelection } from '@/features/entities/search-results-selection.slice';

/** Clear selection when search params change, except when only `page`/`limit` changes. */
export function useClearSearchResultsSelection(): void {
  const dispatch = useAppDispatch();

  const { searchParams } = useSearchParams();

  const sanitizedSearchParams = useMemo(() => {
    if (searchParams == null) return null;

    const _searchParams = new URLSearchParams(searchParams);
    _searchParams.delete('page');
    _searchParams.delete('limit');

    return String(_searchParams);
  }, [searchParams]);

  useEffect(() => {
    if (sanitizedSearchParams != null) {
      dispatch(clearSelection());
    }
  }, [dispatch, sanitizedSearchParams]);
}
