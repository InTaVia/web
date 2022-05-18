import Typography from '@mui/material/Typography';

import { usePersonsSearchResults } from '@/features/entities/use-persons-search-results';

export function SearchResultsLoadingIndicator(): JSX.Element | null {
  const searchResults = usePersonsSearchResults();

  if (!searchResults.isFetching) return null;

  return <Typography>Loading...</Typography>;
}
