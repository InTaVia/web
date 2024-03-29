import type { Entity } from '@intavia/api-client';

import { useGetEntityByIdQuery } from '@/api/intavia.service';
import { useAppSelector } from '@/app/store';
import { selectEntities } from '@/app/store/intavia.slice';

type UseEntityResult =
  | {
      data: Entity;
      status: 'success';
    }
  | {
      data: undefined;
      status: 'error' | 'pending';
    };

export function useEntity(id: Entity['id'] | undefined): UseEntityResult {
  const entities = useAppSelector(selectEntities);
  const stored = id != null ? entities[id] : null;

  const query = useGetEntityByIdQuery(
    { id: id! },
    { skip: id == null || id === '' || stored != null },
  );

  // TODO: return query.data instead of relying on populating store in extra-reducer?
  if (stored != null) {
    return { data: stored, status: 'success' };
  }

  return { data: undefined, status: query.isError ? 'error' : 'pending' };
}
