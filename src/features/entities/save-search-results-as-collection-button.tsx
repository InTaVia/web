import { Dialog, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { nanoid } from '@reduxjs/toolkit';
import type { FormEvent } from 'react';
import { Fragment } from 'react';

import { addNotification } from '@/app/notifications/notifications.slice';
import { useAppDispatch } from '@/app/store';
import type { QueryMetadata } from '@/features/common/entities.slice';
import { addCollection } from '@/features/common/entities.slice';
import type { Entity } from '@/features/common/entity.model';
import intaviaService from '@/features/common/intavia-api.service';
import { usePersonsSearchFilters } from '@/features/entities/use-persons-search-filters';
import { usePersonsSearchResults } from '@/features/entities/use-persons-search-results';
import { useDialogState } from '@/features/ui/use-dialog-state';

export function SaveSearchResultsAsCollectionButton(): JSX.Element {
  const dispatch = useAppDispatch();
  const searchFilters = usePersonsSearchFilters();
  const searchResults = usePersonsSearchResults();
  const endpoint = 'getPersons';
  const [trigger] = intaviaService.endpoints[endpoint].useLazyQuery();
  const dialog = useDialogState();

  async function onSave(name: string) {
    const ids: Array<Entity['id']> = [];
    const queries: Array<QueryMetadata> = [];
    const searchParams = { ...searchFilters };

    const toastId = 'add-collection';
    dispatch(
      addNotification({ message: 'Saving collection...', type: 'informative', id: toastId }),
    );

    async function getEntities(page = 1) {
      const params = { ...searchParams, page };
      queries.push({ endpoint, params });

      const query = await trigger(params, true);
      const entities = query.data?.entities ?? [];
      ids.push(
        ...entities.map((entity) => {
          return entity.id;
        }),
      );

      return query;
    }

    let page = 1;
    while (page < ((await getEntities(page)).data?.pages ?? 1)) {
      page++;
    }

    const collection = {
      id: nanoid(),
      name,
      entities: ids,
      metadata: { queries },
    };

    dispatch(addCollection(collection));
    dispatch(addNotification({ message: 'Collection saved', type: 'informative', id: toastId }));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    void onSave(name);

    dialog.close();

    event.preventDefault();
  }

  return (
    <Fragment>
      <Button
        disabled={searchResults.data == null || searchResults.data.count === 0}
        onClick={dialog.open}
        variant="outlined"
      >
        Save results as collection
      </Button>
      <Dialog fullWidth maxWidth="sm" open={dialog.isOpen} onClose={dialog.close}>
        <DialogTitle component="h2" variant="h4">
          Save collection
        </DialogTitle>
        <form onSubmit={onSubmit}>
          <DialogContent dividers>
            {searchResults.data != null ? (
              <Typography>Save {searchResults.data.count} entities to new collection.</Typography>
            ) : null}
            <TextField autoComplete="off" fullWidth label="Name" name="name" required />
          </DialogContent>
          <DialogActions>
            <Button onClick={dialog.close}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  );
}
