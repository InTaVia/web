import { LoadingIndicator } from '@intavia/ui';

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
    <div className="min-h-0 overflow-auto bg-neutral-50">
      <SearchResultsList />
      <SearchPageFooter />
    </div>
  );
}
