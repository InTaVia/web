import { useSearchEntitiesResults } from '@/components/search/use-search-entities-results';

export function SearchResultsCount(): JSX.Element {
  const searchResults = useSearchEntitiesResults();
  const entities = searchResults.data?.results ?? [];

  if (searchResults.isFetching === true) return <div></div>;
  if (entities.length === 0) return <div></div>;

  return <p>Results: {entities.length}</p>;
}
