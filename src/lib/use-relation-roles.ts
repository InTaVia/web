import { type EntityRelationRole } from '@intavia/api-client';

import { useRetrieveRelationRolesByIdsQuery } from '@/api/intavia.service';
import { useAppSelector } from '@/app/store';
import { selectVocabularyEntries } from '@/app/store/intavia.slice';
import { getData } from '@/lib/get-data';

type UseRelationRolesResult =
  | {
      data: Map<EntityRelationRole['id'], EntityRelationRole> | undefined;
      status: 'error' | 'pending';
    }
  | {
      data: Map<EntityRelationRole['id'], EntityRelationRole>;
      status: 'success';
    };

export function useRelationRoles(ids: Array<EntityRelationRole['id']>): UseRelationRolesResult {
  const _data = useAppSelector(selectVocabularyEntries);

  const { data, missing, isComplete } = getData(_data, ids);

  const query = useRetrieveRelationRolesByIdsQuery(
    { body: { id: Array.from(missing) }, params: {} },
    { skip: isComplete },
  );

  if (isComplete) {
    return { data, status: 'success' };
  }

  return { data: data, status: query.isError ? 'error' : 'pending' };
}
