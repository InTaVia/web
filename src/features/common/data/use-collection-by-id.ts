import { useAppSelector } from '@/app/store';
import type { Collection } from '@/app/store/intavia-collections.slice';
import { selectCollectionById } from '@/app/store/intavia-collections.slice';

interface UseCollectionParams {
  collectionId: Collection['id'];
}

export function useCollectionById(params: UseCollectionParams): Collection | undefined {
  const { collectionId } = params;
  return useAppSelector((state) => {
    return selectCollectionById(state, collectionId);
  });
}
