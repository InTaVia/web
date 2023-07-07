import type { Event } from '@intavia/api-client';

import { useGetEventByIdQuery } from '@/api/intavia.service';
import { useAppSelector } from '@/app/store';
import { selectEvents } from '@/app/store/intavia.slice';

type UseEventResult =
  | {
      data: Event;
      status: 'success';
    }
  | {
      data: undefined;
      status: 'error' | 'pending';
    };

export function useEntityEvent(id: Event['id'] | undefined): UseEventResult {
  const entities = useAppSelector(selectEvents);
  const stored = id != null ? entities[id] : null;

  const query = useGetEventByIdQuery(
    { id: id! },
    { skip: id == null || id === '' || stored != null },
  );

  // TODO: return query.data instead of relying on populating store in extra-reducer?
  if (stored != null) {
    return { data: stored, status: 'success' };
  }

  return { data: undefined, status: query.isError ? 'error' : 'pending' };
}
