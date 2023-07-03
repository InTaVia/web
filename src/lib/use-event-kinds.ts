import { type EventKind } from '@intavia/api-client';

import { useRetrieveEventKindsByIdsQuery } from '@/api/intavia.service';
import { useAppSelector } from '@/app/store';
import { selectVocabularyEntries } from '@/app/store/intavia.slice';
import { getData } from '@/lib/get-data';

type UseEventKindsResult =
  | {
      data: Map<EventKind['id'], EventKind> | undefined;
      status: 'error' | 'pending';
    }
  | {
      data: Map<EventKind['id'], EventKind>;
      status: 'success';
    };

export function useEventKinds(ids: Array<EventKind['id']>): UseEventKindsResult {
  const _data = useAppSelector(selectVocabularyEntries);

  const { data, missing, isComplete } = getData(_data, ids);

  const query = useRetrieveEventKindsByIdsQuery(
    { body: { id: Array.from(missing) }, params: {} },
    { skip: isComplete },
  );

  if (isComplete) {
    return { data, status: 'success' };
  }

  return { data: data, status: query.isError ? 'error' : 'pending' };
}
