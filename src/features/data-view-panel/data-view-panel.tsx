import { Box, List, ListItem, Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import TextField from '@mui/material/TextField';
import type { ChangeEvent } from 'react';
import { Fragment, useState } from 'react';

import type { Person } from '@intavia/api-client';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { selectEntities } from '@/app/store/intavia.slice';
import type { Collection } from '@/app/store/intavia-collections.slice';
import { selectCollections } from '@/app/store/intavia-collections.slice';
import { addPersonToVisualization } from '@/features/common/visualization.slice';
import CollectionPanelEntry from '@/features/entities/collection-panel-entry';
import { selectAllWorkspaces } from '@/features/visualization-layouts/workspaces.slice';

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
                {collection.label}
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
  const dispatch = useAppDispatch();
  const workspaces = useAppSelector(selectAllWorkspaces);
  const currentWorkspace = workspaces.workspaces[workspaces.currentWorkspace];

  const limit = 10;
  const [page, setPage] = useState(1);
  const _entities = useAppSelector(selectEntities);
  const entities = collection.entities.map((id) => {
    return _entities[id];
  });
  const pages = Math.ceil(collection.entities.length / limit);

  function viewAllData() {
    const currentVisualizationIds = Object.values(currentWorkspace!.visualizationSlots);
    for (const visualizationId of currentVisualizationIds) {
      if (visualizationId != null) {
        for (const entity of entities) {
          dispatch(addPersonToVisualization({ visId: visualizationId, person: entity as Person }));
        }
      }
    }
  }

  return (
    <Fragment>
      <button onClick={viewAllData}>View All Data</button>
      <List role="list">
        {entities.slice((page - 1) * limit, page * limit).map((entity) => {
          if (entity == null) return;

          return (
            <ListItem key={entity.id} sx={{ paddingBlock: 2 }}>
              <CollectionPanelEntry entity={entity} draggable mini />
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
