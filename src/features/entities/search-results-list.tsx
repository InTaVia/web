import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

import { SearchResult } from '@/features/entities/search-result';
import { usePersonsSearchResults } from '@/features/entities/use-persons-search-results';

export function SearchResultsList(): JSX.Element {
  const searchResults = usePersonsSearchResults();
  const persons = searchResults.data?.entities ?? [];

  if (persons.length === 0) {
    return (
      <Box
        sx={{
          display: 'grid',
          placeContent: 'center',
          borderTopWidth: 1,
          borderTopStyle: 'solid',
          borderTopColor: '#eee',
          padding: 2,
        }}
      >
        <Typography>Nothing to see.</Typography>
      </Box>
    );
  }

  return (
    <div className="h-full overflow-hidden overflow-y-scroll">
      <List role="list" sx={{ borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: '#eee' }}>
        {persons.map((person) => {
          return (
            <ListItem key={person.id} sx={{ paddingBlock: 2 }}>
              <SearchResult displaySelectionCheckBox entity={person} />
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
