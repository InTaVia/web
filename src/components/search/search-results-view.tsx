import { LoadingIndicator } from '@/components/loading-indicator';
import { SearchPageFooter } from '@/components/search/search-page-footer';
import { SearchResultsList } from '@/components/search/search-results-list';
import { useSearchEntitiesResults } from '@/components/search/use-search-entities-results';

export function SearchResultsView(): JSX.Element {
  const isLoading = useSearchEntitiesResults().isLoading;

  if (isLoading) {
    return (
      <div className="grid h-full w-full place-items-center bg-neutral-50">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="grid h-full min-h-0 grid-rows-[1fr_auto] overflow-auto bg-neutral-50">
      <SearchResultsList />
      <SearchPageFooter />
    </div>
  );
}
