import { Dialog, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { nanoid } from '@reduxjs/toolkit';
import type { FormEvent } from 'react';
import { Fragment } from 'react';

import { addCollection } from '@/features/common/entities.slice';
import type { Entity } from '@/features/common/entity.model';
import intaviaService from '@/features/common/intavia-api.service';
import { useAppDispatch } from '@/features/common/store';
import { usePersonsSearchFilters } from '@/features/entities/use-persons-search-filters';
import { addNotification } from '@/features/notifications/notifications.slice';
import { PageTitle } from '@/features/ui/PageTitle';
import { useDialogState } from '@/features/ui/use-dialog-state';

export function SearchPageHeader(): JSX.Element {
  return (
    <Box
      component="header"
      sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}
    >
      <PageTitle>Search</PageTitle>
      <SaveSearchResultsAsCollectionButton />
    </Box>
  );
}

function SaveSearchResultsAsCollectionButton(): JSX.Element {
  const dispatch = useAppDispatch();
  const searchFilters = usePersonsSearchFilters();
  const dialog = useDialogState();

  async function onSave(name: string) {
    const ids: Array<Entity['id']> = [];
    const searchParams = { ...searchFilters };

    async function getEntities(page = 1) {
      const params = { ...searchParams, page };
      const query = await dispatch(intaviaService.endpoints.getPersons.initiate(params));
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
      metadata: { queries: [] },
    };

    dispatch(addCollection(collection));
    dispatch(addNotification({ message: 'Collection saved', type: 'informative' }));

    dialog.close();
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    void onSave(name);
    event.preventDefault();
  }

  return (
    <Fragment>
      <Button onClick={dialog.open} variant="outlined">
        Save results as collection
      </Button>
      <Dialog fullWidth maxWidth="sm" open={dialog.isOpen} onClose={dialog.close}>
        <DialogTitle component="h2" variant="h4">
          Save collection
        </DialogTitle>
        <form onSubmit={onSubmit}>
          <DialogContent dividers>
            <TextField fullWidth label="Name" name="name" required />
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
