import { SearchResultsCount } from '@/components/search/search-results-count';
import { SearchResultsPagination } from '@/components/search/search-results-pagination';

export function SearchPageFooter(): JSX.Element {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-neutral-200 py-4 px-8">
      <SearchResultsCount />
      <SearchResultsPagination />
    </footer>
  );
}
