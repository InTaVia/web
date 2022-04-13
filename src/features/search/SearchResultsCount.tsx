import Typography from '@mui/material/Typography';

import { usePersonsSearchResults } from '@/features/search/usePersonsSearchResults';

export function SearchResultsCount(): JSX.Element | null {
  const searchResults = usePersonsSearchResults();
  const persons = searchResults.data?.entities ?? [];

  if (searchResults.isFetching) return null;
  if (persons.length === 0) return null;

  return <Typography>Results: {persons.length}</Typography>;
}
