import Typography from '@mui/material/Typography';

import { usePersonsSearchResults } from '@/features/entities/use-persons-search-results';

export function SearchResultsCount(): JSX.Element {
  const searchResults = usePersonsSearchResults();
  const persons = searchResults.data?.entities ?? [];

  if (searchResults.isFetching) return <div></div>;
  if (persons.length === 0) return <div></div>;

  return <Typography>Results: {persons.length}</Typography>;
}
