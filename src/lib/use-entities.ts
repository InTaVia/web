import type { Entity } from '@intavia/api-client';

import { useRetrieveEntitiesByIdsQuery } from '@/api/intavia.service';
import { useAppSelector } from '@/app/store';
import { selectEntities } from '@/app/store/intavia.slice';
import { getData } from '@/lib/get-data';

type UseEntitiesResult =
  | {
      data: Map<Entity['id'], Entity> | undefined;
      status: 'error' | 'pending';
    }
  | {
      data: Map<Entity['id'], Entity>;
      status: 'success';
    };

export function useEntities(ids: Array<Entity['id']>): UseEntitiesResult {
  const _data = useAppSelector(selectEntities);

  const { data, missing, isComplete } = getData(_data, ids);

  const query = useRetrieveEntitiesByIdsQuery(
    {
      body: { id: Array.from(missing) },
      params: {},
    },
    { skip: isComplete },
  );

  if (isComplete) {
    return { data, status: 'success' };
  }

  return { data, status: query.isError ? 'error' : 'pending' };
}
