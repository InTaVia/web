import { SearchResult } from '@/features/entities/search-result';
import { useSearchEntitiesResults } from '@/features/entities/use-search-entities-results';

export function SearchResultsList(): JSX.Element {
  const searchResults = useSearchEntitiesResults();
  const entities = searchResults.data?.results ?? [];

  if (entities.length === 0) {
    return (
      <div
        style={{
          display: 'grid',
          placeContent: 'center',
          borderTopWidth: 1,
          borderTopStyle: 'solid',
          borderTopColor: '#eee',
          padding: 2,
        }}
      >
        <p>Nothing to see.</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden overflow-y-scroll">
      <ul
        role="list"
        style={{ borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: '#eee' }}
      >
        {entities.map((entity) => {
          return (
            <li key={entity.id} style={{ paddingBlock: 2 }}>
              <SearchResult displaySelectionCheckBox entity={entity} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
