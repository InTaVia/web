import { ClipLoader } from 'react-spinners';

import { SearchPageFooter } from '@/features/entities/search-page-footer';
import { SearchResultsList } from '@/features/entities/search-results-list';
import { usePersonsSearchResults } from '@/features/entities/use-persons-search-results';

export function SearchResultsView(): JSX.Element {
  const isLoading = usePersonsSearchResults().isLoading;

  if (isLoading) {
    return (
      <div className="grid h-full w-full items-center justify-center">
        <ClipLoader loading={isLoading} size="40" color="#94c269" />
      </div>
    );
  }

  return (
    <div>
      <SearchResultsList />
      <SearchPageFooter />
    </div>
  );
}
