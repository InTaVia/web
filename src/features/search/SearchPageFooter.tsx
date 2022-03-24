import { Box } from '@mui/system';

import { SearchResultsCount } from '@/features/search/SearchResultsCount';
import { SearchResultsLoadingIndicator } from '@/features/search/SearchResultsLoadingIndicator';
import { SearchResultsPagination } from '@/features/search/SearchResultsPagination';

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
