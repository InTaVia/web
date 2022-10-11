import { ClipLoader } from 'react-spinners';

import { SearchPageFooter } from '@/features/entities/search-page-footer';
import { SearchResultsList } from '@/features/entities/search-results-list';
import { useSearchEntitiesResults } from '@/features/entities/use-search-entities-results';

export function SearchResultsView(): JSX.Element {
  const isLoading = useSearchEntitiesResults().isLoading;

  if (isLoading) {
    return (
      <div className="grid h-full w-full items-center justify-center">
        <ClipLoader loading={isLoading} size="40px" color="#94c269" />
      </div>
    );
  }

  return (
    <div className="grid h-full">
      <SearchResultsList />
      <SearchPageFooter />
    </div>
  );
}
