import { SearchResultsCount } from '@/features/entities/search-results-count';
import { SearchResultsPagination } from '@/features/entities/search-results-pagination';

export function SearchPageFooter(): JSX.Element {
  return (
    <footer
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 2,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        borderTopStyle: 'solid',
      }}
    >
      <SearchResultsCount />
      <SearchResultsPagination />
    </footer>
  );
}
