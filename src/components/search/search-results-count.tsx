import { useSearchEntitiesResults } from '@/components/search/use-search-entities-results';

export function SearchResultsCount(): JSX.Element {
  const searchResults = useSearchEntitiesResults();
  const count = searchResults.data?.count;

  if (searchResults.isFetching === true) return <div></div>;
  if (count === 0) return <div></div>;

  return <p>Results: {count}</p>;
}
