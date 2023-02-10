import { useAppSelector } from '@/app/store';
import type { Collection } from '@/app/store/intavia-collections.slice';
import { selectCollections } from '@/app/store/intavia-collections.slice';

export function useCollections(): Record<Collection['id'], Collection> {
  return useAppSelector(selectCollections);
}
