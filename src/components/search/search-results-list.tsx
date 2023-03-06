import { cn, LoadingIndicator } from '@intavia/ui';

import { NothingFoundMessage } from '@/components/nothing-found-message';
import { SearchResult } from '@/components/search/search-result';
import { useSearchEntitiesResults } from '@/components/search/use-search-entities-results';

export function SearchResultsList(): JSX.Element {
  const searchResults = useSearchEntitiesResults();
  const entities = searchResults.data?.results ?? [];

  if (!searchResults.isFetching && entities.length === 0) {
    return (
      <div className="grid place-items-center">
        <NothingFoundMessage />
      </div>
    );
  }

  return (
    <div className="relative">
      <ul
        role="list"
        className={cn('divide-y-200 divide-y transition-all', {
          'opacity-50 grayscale': searchResults.isFetching,
        })}
      >
        {entities.map((entity) => {
          return (
            <li key={entity.id} className="odd:bg-white">
              <SearchResult entity={entity} />
            </li>
          );
        })}
      </ul>
      {searchResults.isFetching ? (
        <div className="absolute inset-0 grid place-items-center">
          <LoadingIndicator />
        </div>
      ) : null}
    </div>
  );
}
