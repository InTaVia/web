import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { nanoid } from '@reduxjs/toolkit';
import type { FormEvent } from 'react';
import { Fragment } from 'react';

import { addNotification } from '@/app/notifications/notifications.slice';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { addCollection } from '@/app/store/intavia-collections.slice';
import { selectSearchResultsSelection } from '@/features/entities/search-results-selection.slice';
import { useClearSearchResultsSelection } from '@/features/entities/use-clear-search-results-selection';
import { useDialogState } from '@/features/ui/use-dialog-state';

export function SearchResultsSelection(): JSX.Element {
  const dispatch = useAppDispatch();
  const selectedEntities = useAppSelector(selectSearchResultsSelection);
  const dialog = useDialogState();
  useClearSearchResultsSelection();

  function onSave(label: string) {
    const collection = {
      id: nanoid(),
      label,
      entities: Array.from(selectedEntities),
      events: [],
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
      <div
        style={{
          paddingInline: 2,
          paddingBlock: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTopWidth: 1,
          borderTopStyle: 'solid',
          borderTopColor: '#eee',
        }}
      >
        <p>Selected: {selectedEntities.length}</p>
        <Button disabled={selectedEntities.length === 0} onClick={dialog.open} variant="outlined">
          Save selection as collection
        </Button>
      </div>
      <Dialog fullWidth maxWidth="sm" open={dialog.isOpen} onClose={dialog.close}>
        <DialogTitle component="h2" variant="h4">
          Save collection
        </DialogTitle>
        <form onSubmit={onSubmit}>
          <DialogContent dividers sx={{ display: 'grid', gap: 1.5 }}>
            <p>Save {selectedEntities.length} entities to new collection.</p>
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
