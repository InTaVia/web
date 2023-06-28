import { assert } from '@stefanprobst/assert';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store';
import type { Collection } from '@/app/store/intavia-collections.slice';
import { selectSelectedCollection, setSelectedCollection } from '@/features/ui/ui.slice';

interface CollectionContextValue {
  currentCollection: Collection['id'] | null;
  setCurrentCollection: (id: Collection['id'] | null) => void;
}

const CollectionContext = createContext<CollectionContextValue | null>(null);

interface CollectionProviderProps {
  children: ReactNode;
}

export function CollectionProvider(props: CollectionProviderProps) {
  const { children } = props;
  const dispatch = useAppDispatch();

  //const [currentCollection, setCurrentCollection] = useState<Collection['id'] | null>(null);
  const currentCollection = useAppSelector(selectSelectedCollection);
  const setCurrentCollection = useCallback(
    (id: Collection['id'] | null) => {
      dispatch(setSelectedCollection(id));
    },
    [dispatch],
  );

  const value = useMemo(() => {
    return { currentCollection, setCurrentCollection };
  }, [currentCollection, setCurrentCollection]);

  return <CollectionContext.Provider value={value}>{children}</CollectionContext.Provider>;
}

export function useCollection(): CollectionContextValue {
  const value = useContext(CollectionContext);

  assert(value);

  return value;
}
