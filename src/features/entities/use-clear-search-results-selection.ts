import { useEffect, useMemo } from 'react';

import { useSearchParams } from '@/app/route/use-search-params';
import { useAppDispatch } from '@/app/store';
import { clearSelection } from '@/features/entities/search-results-selection.slice';

/** Clear selection when search params change, except when only `page` changes. */
export function useClearSearchResultsSelection() {
  const dispatch = useAppDispatch();

  const searchParams = useSearchParams();
  const searchParamsWithoutPage = useMemo(() => {
    if (searchParams == null) return null;
    const _searchParams = new URLSearchParams(searchParams);
    _searchParams.delete('page');
    return String(_searchParams);
  }, [searchParams]);

  useEffect(() => {
    if (searchParamsWithoutPage != null) {
      dispatch(clearSelection());
    }
  }, [dispatch, searchParamsWithoutPage]);
}
