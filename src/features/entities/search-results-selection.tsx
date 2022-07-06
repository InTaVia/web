import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { nanoid } from '@reduxjs/toolkit';
import type { FormEvent } from 'react';
import { Fragment } from 'react';

import { addNotification } from '@/app/notifications/notifications.slice';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { addCollection } from '@/features/common/entities.slice';
import { selectSearchResultsSelection } from '@/features/entities/search-results-selection.slice';
import { useDialogState } from '@/features/ui/use-dialog-state';

export function SearchResultsSelection(): JSX.Element {
  const dispatch = useAppDispatch();
  const selectedEntities = useAppSelector(selectSearchResultsSelection);
  const dialog = useDialogState();

  function onSave(name: string) {
    const collection = {
      id: nanoid(),
      name,
      entities: Array.from(selectedEntities),
      metadata: {},
    };

    const toastId = 'add-collection';
    dispatch(addCollection(collection));
    dispatch(addNotification({ message: 'Collection saved', type: 'informative', id: toastId }));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    onSave(name);

    dialog.close();

    event.preventDefault();
  }

  return (
    <Fragment>
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTopWidth: 1,
          borderTopStyle: 'solid',
          borderTopColor: '#eee',
        }}
      >
        <Typography>Selected: {selectedEntities.length}</Typography>
        <Button disabled={selectedEntities.length === 0} onClick={dialog.open} variant="outlined">
          Save selection as collection
        </Button>
      </Box>
      <Dialog fullWidth maxWidth="sm" open={dialog.isOpen} onClose={dialog.close}>
        <DialogTitle component="h2" variant="h4">
          Save collection
        </DialogTitle>
        <form onSubmit={onSubmit}>
          <DialogContent dividers sx={{ display: 'grid', gap: 1.5 }}>
            <Typography>Save {selectedEntities.length} entities to new collection.</Typography>
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
