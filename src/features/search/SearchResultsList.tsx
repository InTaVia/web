import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

import { selectLocalEntities } from '@/features/common/entities.slice';
import type { Entity } from '@/features/common/entity.model';
import { useAppSelector } from '@/features/common/store';
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
            <SearchResult entity={person} />
          </ListItem>
        );
      })}
    </List>
  );
}

interface SearchResultProps<T extends Entity> {
  entity: T;
}

function SearchResult<T extends Entity>(props: SearchResultProps<T>): JSX.Element {
  const { entity: upstreamEntity } = props;

  const id = upstreamEntity.id;
  const localEntities = useAppSelector(selectLocalEntities);
  const hasLocalEntity = id in localEntities;

  const entity = hasLocalEntity ? (localEntities[id] as T) : upstreamEntity;

  return (
    <Box component="article" sx={{ width: '100%' }}>
      <Link href={{ pathname: `/${entity.kind}/${entity.id}` }}>
        <a style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>{entity.name}</Typography>
          {hasLocalEntity ? <span> (edited locally)</span> : null}
        </a>
      </Link>
    </Box>
  );
}
