import { assert } from '@stefanprobst/assert';
import type { ReactNode } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

import type { Collection } from '@/app/store/intavia-collections.slice';

interface CollectionContextValue {
  currentCollection: Collection['id'] | null;
  setCurrentCollection: (id: Collection['id']) => void;
}

const CollectionContext = createContext<CollectionContextValue | null>(null);

interface CollectionProviderProps {
  children: ReactNode;
}

export function CollectionProvider(props: CollectionProviderProps) {
  const { children } = props;

  const [currentCollection, setCurrentCollection] = useState<Collection['id'] | null>(null);

  const value = useMemo(() => {
    return { currentCollection, setCurrentCollection };
  }, [currentCollection]);

  return <CollectionContext.Provider value={value}>{children}</CollectionContext.Provider>;
}

export function useCollection(): CollectionContextValue {
  const value = useContext(CollectionContext);

  assert(value);

  return value;
}
