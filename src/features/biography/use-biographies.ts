import type { Biography } from '@intavia/api-client';

import { useRetrieveBiographiesByIdsQuery } from '@/api/intavia.service';
import { useAppSelector } from '@/app/store';
import { selectBiographies } from '@/app/store/intavia.slice';
import { getData } from '@/lib/get-data';

type useBiographiesResult =
  | {
      data: Map<Biography['id'], Biography> | undefined;
      status: 'error' | 'pending';
    }
  | {
      data: Map<Biography['id'], Biography>;
      status: 'success';
    };

export function useBiographies(ids: Array<Biography['id']>): useBiographiesResult {
  const _data = useAppSelector(selectBiographies);

  const { data, missing, isComplete } = getData(_data, ids);

  const query = useRetrieveBiographiesByIdsQuery(
    {
      body: { id: Array.from(missing) },
      params: {},
    },
    { skip: isComplete },
  );

  if (isComplete) {
    return { data, status: 'success' };
  }

  return { data, status: query.isError === true ? 'error' : 'pending' };
}
