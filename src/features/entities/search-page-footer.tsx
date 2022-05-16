import { Box } from '@mui/system';

import { SearchResultsCount } from '@/features/entities/search-results-count';
import { SearchResultsLoadingIndicator } from '@/features/entities/search-results-loading-indicator';
import { SearchResultsPagination } from '@/features/entities/search-results-pagination';

export function SearchPageFooter(): JSX.Element {
  return (
    <Box
      component="footer"
      sx={{
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
      <SearchResultsLoadingIndicator />
      <SearchResultsPagination />
    </Box>
  );
}
