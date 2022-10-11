import { Box, List, ListItem, Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import TextField from '@mui/material/TextField';
import type { ChangeEvent } from 'react';
import { Fragment, useState } from 'react';

import { useAppSelector } from '@/app/store';
import type { Collection } from '@/app/store/entities.slice';
import { selectCollections, selectEntities } from '@/app/store/entities.slice';
import { SearchResult } from '@/features/entities/search-result';

export function CollectionEntitiesList(): JSX.Element {
  const _collections = useAppSelector(selectCollections);
  const collections = Object.values(_collections);
  const [selected, setSelected] = useState<Collection['id']>('');
  const collection = selected.length === 0 ? null : _collections[selected];

  function onSelectionChange(event: ChangeEvent<HTMLInputElement>) {
    setSelected(event.target.value);
  }

  if (collections.length === 0) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography>No saved collections available.</Typography>
      </Box>
    );
  }

  return (
    <Fragment>
      <Box component="header" sx={{ display: 'grid', padding: 2 }}>
        <TextField label="Collection" onChange={onSelectionChange} select value={selected}>
          {collections.map((collection) => {
            return (
              <MenuItem key={collection.id} value={collection.id}>
                {collection.name}
              </MenuItem>
            );
          })}
        </TextField>
      </Box>
      {collection != null ? (
        <Box
          component="section"
          sx={{
            borderTopWidth: 1,
            borderTopStyle: 'solid',
            borderTopColor: '#eee',
          }}
        >
          <CollectionEntities collection={collection} />
        </Box>
      ) : null}
    </Fragment>
  );
}

interface CollectionEntitiesProps {
  collection: Collection;
}

function CollectionEntities(props: CollectionEntitiesProps): JSX.Element {
  const { collection } = props;

  const limit = 10;
  const [page, setPage] = useState(1);
  const _entities = useAppSelector(selectEntities);
  const entities = collection.entities.map((id) => {
    return _entities[id];
  });
  const pages = Math.ceil(collection.entities.length / limit);

  return (
    <Fragment>
      <List role="list">
        {entities.slice((page - 1) * limit, page * limit).map((entity) => {
          if (entity == null) return;

          return (
            <ListItem key={entity.id} sx={{ paddingBlock: 2 }}>
              <SearchResult entity={entity} />
            </ListItem>
          );
        })}
      </List>
      {pages <= 1 ? null : (
        <Box
          component="footer"
          sx={{
            borderTopWidth: 1,
            borderTopStyle: 'solid',
            borderTopColor: '#eee',
            padding: 2,
            display: 'grid',
            justifyItems: 'end',
          }}
        >
          <Pagination
            page={page}
            count={pages}
            onChange={(_, page) => {
              setPage(page);
            }}
          />
        </Box>
      )}
    </Fragment>
  );
}
