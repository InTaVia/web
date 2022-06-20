import { assert } from '@stefanprobst/assert';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { useSearchParams } from '@/app/route/use-search-params';
import type { Entity } from '@/features/common/entity.model';

interface SearchResultsSelectionContextValue {
  selectedEntities: Set<Entity['id']>;
  onSelectEntity: (id: Entity['id'], isSelected: boolean) => void;
}

const SearchResultsSelectionContext = createContext<SearchResultsSelectionContextValue | null>(
  null,
);

interface SearchResultsSelectionProviderProps {
  children: ReactNode;
}

// TODO: put selection state in redux store? e.g. should selection state be kept when navigating
// from search results page to entity details page, and then back again?
export function SearchResultsSelectionProvider(
  props: SearchResultsSelectionProviderProps,
): JSX.Element {
  const { children } = props;

  /** Wrap `Set` in array to avoid recalculating hashes on every change. */
  const [_selectedEntities, setSelectedEntities] = useState<[Set<Entity['id']>]>([new Set()]);
  /** Clear selection when search params change, except when only `page` changes. */
  const searchParams = useSearchParams();
  const searchParamsWithoutPage = useMemo(() => {
    if (searchParams == null) return null;
    const _searchParams = new URLSearchParams(searchParams);
    _searchParams.delete('page');
    return String(_searchParams);
  }, [searchParams]);

  useEffect(() => {
    if (searchParamsWithoutPage != null) {
      setSelectedEntities([new Set()]);
    }
  }, [searchParamsWithoutPage]);

  const value = useMemo(() => {
    const [selectedEntities] = _selectedEntities;

    function onSelectEntity(id: Entity['id'], isSelected: boolean) {
      if (isSelected) {
        selectedEntities.add(id);
      } else {
        selectedEntities.delete(id);
      }
      setSelectedEntities([selectedEntities]);
    }

    return {
      selectedEntities,
      onSelectEntity,
    };
  }, [_selectedEntities]);

  return (
    <SearchResultsSelectionContext.Provider value={value}>
      {children}
    </SearchResultsSelectionContext.Provider>
  );
}

export function useSearchResultsSelection(): SearchResultsSelectionContextValue {
  const value = useContext(SearchResultsSelectionContext);

  assert(value != null);

  return value;
}
