import Typography from '@mui/material/Typography';

import { usePersonsSearchResults } from '@/features/search/usePersonsSearchResults';

export function SearchResultsLoadingIndicator(): JSX.Element | null {
  const searchResults = usePersonsSearchResults();

  if (!searchResults.isFetching) return null;

  return <Typography>Loading...</Typography>;
}
