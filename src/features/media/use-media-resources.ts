import type { MediaResource } from '@intavia/api-client';

import { useRetrieveMediaResourcesByIdsQuery } from '@/api/intavia.service';
import { useAppSelector } from '@/app/store';
import { selectMediaResources } from '@/app/store/intavia.slice';
import { getData } from '@/lib/get-data';

type useMediaResourcesResult =
  | {
      data: Map<MediaResource['id'], MediaResource> | undefined;
      status: 'error' | 'pending';
    }
  | {
      data: Map<MediaResource['id'], MediaResource>;
      status: 'success';
    };

export function useMediaResources(ids: Array<MediaResource['id']>): useMediaResourcesResult {
  const _data = useAppSelector(selectMediaResources);

  const { data, missing, isComplete } = getData(_data, ids);

  const query = useRetrieveMediaResourcesByIdsQuery(
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
