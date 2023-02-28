import { SearchResultsCount } from '@/components/search/search-results-count';
import { SearchResultsPagination } from '@/components/search/search-results-pagination';

export function SearchPageFooter(): JSX.Element {
  return (
    <footer className="flex items-center justify-between gap-8 bg-white px-8 py-2">
      <SearchResultsCount />
      <SearchResultsPagination />
    </footer>
  );
}
