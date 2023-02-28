import { Button, Dialog, DialogTrigger } from '@intavia/ui';
import { useState } from 'react';

import { useAppDispatch } from '@/app/store';
import { addEntitiesToCollection } from '@/app/store/intavia-collections.slice';
import { useCollection } from '@/components/search/collection.context';
import { SaveQueryAsCollectionDialog } from '@/components/search/save-query-as-collection-dialog';
import { useAllSearchResults } from '@/components/search/use-all-search-results';

export function SearchResultsToolbar(): JSX.Element {
  return (
    <div className="flex justify-between gap-2 border-b border-neutral-200 px-8 py-4">
      <SaveQueryAsCollectionButton />
      <AddQueryToCollectionButton />
    </div>
  );
}

function SaveQueryAsCollectionButton() {
  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create new collection from query</Button>
      </DialogTrigger>
      <SaveQueryAsCollectionDialog
        onClose={() => {
          setDialogOpen(false);
        }}
      />
    </Dialog>
  );
}

function AddQueryToCollectionButton(): JSX.Element {
  const dispatch = useAppDispatch();
  const { currentCollection } = useCollection();
  const { getSearchResults } = useAllSearchResults();

  async function onAddQueryToCollection() {
    if (currentCollection == null) return;

    const { entities } = await getSearchResults();
    dispatch(addEntitiesToCollection({ id: currentCollection, entities }));
  }

  return (
    <Button disabled={currentCollection == null} onClick={onAddQueryToCollection} variant="outline">
      Add query to collection
    </Button>
  );
}
