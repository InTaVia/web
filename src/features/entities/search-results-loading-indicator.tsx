import { useSearchEntitiesResults } from '@/features/entities/use-search-entities-results';

export function SearchResultsLoadingIndicator(): JSX.Element | null {
  const searchResults = useSearchEntitiesResults();

  if (!searchResults.isFetching) return null;

  return <p>Loading...</p>;
}
