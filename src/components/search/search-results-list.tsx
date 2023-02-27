import { NothingFoundMessage } from '@/components/nothing-found-message';
import { SearchResult } from '@/components/search/search-result';
import { useSearchEntitiesResults } from '@/components/search/use-search-entities-results';

export function SearchResultsList(): JSX.Element {
  const searchResults = useSearchEntitiesResults();
  const entities = searchResults.data?.results ?? [];

  if (entities.length === 0) {
    return <NothingFoundMessage />;
  }

  return (
    <ul role="list" className="divide-y-200 divide-y">
      {entities.map((entity) => {
        return (
          <li key={entity.id} className="odd:bg-white">
            <SearchResult entity={entity} />
          </li>
        );
      })}
    </ul>
  );
}
