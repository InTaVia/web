import { SearchResultsCount } from '@/components/search/search-results-count';
import { SearchResultsPagination } from '@/components/search/search-results-pagination';

export function SearchPageFooter(): JSX.Element {
  return (
    <footer className="flex items-center justify-between gap-8 border-t border-neutral-200 bg-white py-12 px-8">
      <SearchResultsCount />
      <SearchResultsPagination />
    </footer>
  );
}
