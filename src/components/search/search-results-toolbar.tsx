import { Button, Dialog, DialogTrigger, useToast } from '@intavia/ui';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';

import { useAppDispatch } from '@/app/store';
import { addEntitiesToCollection } from '@/app/store/intavia-collections.slice';
import { useCollection } from '@/components/search/collection.context';
import { SaveQueryAsCollectionDialog } from '@/components/search/save-query-as-collection-dialog';
import { useAllSearchResults } from '@/components/search/use-all-search-results';

export function SearchResultsToolbar(): JSX.Element {
  return (
    <div className="flex flex-col justify-between gap-2 border-b border-neutral-200 px-8 py-3 lg:flex-row">
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
        <Button variant="subtle">Create new collection from query</Button>
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
  const { toast } = useToast();

  async function onAddQueryToCollection() {
    if (currentCollection == null) return;

    const { dismiss } = toast({
      title: 'Fetching entities',
      description: 'Retrieving search results for current query...',
    });
    const { entities } = await getSearchResults();
    dismiss();

    dispatch(addEntitiesToCollection({ id: currentCollection, entities }));
  }

  return (
    <Button disabled={currentCollection == null} variant="subtle" onClick={onAddQueryToCollection}>
      <PlusIcon className="h-4 w-4 shrink-0" />
      Add query to collection
    </Button>
  );
}
