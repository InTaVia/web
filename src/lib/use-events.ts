import { type Event } from '@intavia/api-client';

import { useRetrieveEventsByIdsQuery } from '@/api/intavia.service';
import { useAppSelector } from '@/app/store';
import { selectEvents } from '@/app/store/intavia.slice';
import { getData } from '@/lib/get-data';

type UseEventsResult =
  | {
      data: Map<Event['id'], Event>;
      status: 'success';
    }
  | {
      data: undefined;
      status: 'error' | 'pending';
    };

export function useEvents(ids: Array<Event['id']>): UseEventsResult {
  const _data = useAppSelector(selectEvents);

  const { data, missing, isComplete } = getData(_data, ids);

  const query = useRetrieveEventsByIdsQuery(
    { body: { id: Array.from(missing) }, params: {} },
    { skip: isComplete },
  );

  if (isComplete) {
    return { data, status: 'success' };
  }

  // TODO: return data when isComplete: false?
  return { data: undefined, status: query.isError ? 'error' : 'pending' };
}
