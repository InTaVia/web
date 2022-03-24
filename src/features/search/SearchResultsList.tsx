import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

import { usePersonsSearchResults } from '@/features/search/usePersonsSearchResults';

export function SearchResultsList(): JSX.Element {
  const searchResults = usePersonsSearchResults();
  const persons = searchResults.data?.entities ?? [];

  if (searchResults.isLoading) {
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
        <Typography role="status">Loading...</Typography>
      </Box>
    );
  }

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
    <List
      component="ul"
      role="list"
      sx={{ borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: '#eee' }}
    >
      {persons.map((person) => {
        return (
          <ListItem key={person.id} sx={{ paddingBlock: 2 }}>
            <article>
              <Link href={{ pathname: `/${person.kind}/${person.id}` }}>
                <a>
                  <Typography>{person.name}</Typography>
                </a>
              </Link>
            </article>
          </ListItem>
        );
      })}
    </List>
  );
}
