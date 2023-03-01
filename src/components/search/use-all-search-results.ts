import { useSearchEntitiesFilters } from '@/components/search/use-search-entities-filters';
import { Entity } from '@intavia/api-client';
import { useLazySearchEntitiesQuery } from '@/api/intavia.service';
import { QueryMetadata } from '@/app/store/intavia-collections.slice';

export function useAllSearchResults() {
  const searchFilters = useSearchEntitiesFilters();
  const [trigger] = useLazySearchEntitiesQuery();

  async function getSearchResults() {
    const endpoint = 'searchEntities';
    const searchParams = { ...searchFilters };
    const queries: Array<QueryMetadata> = [];
    const ids: Array<Entity['id']> = [];

    async function getEntities(page = 1) {
      const params = { ...searchParams, page };
      queries.push({ endpoint, params });

      const query = await trigger(params, true);
      const entities = query.data?.results ?? [];
      ids.push(
        ...entities.map((entity) => {
          return entity.id;
        }),
      );

      return query;
    }

    let page = 0;
    while (++page < ((await getEntities(page)).data?.pages ?? 1)) {
      /** noop */
    }

    return {
      entities: ids,
      metadata: { queries },
    };
  }

  return { getSearchResults };
}
