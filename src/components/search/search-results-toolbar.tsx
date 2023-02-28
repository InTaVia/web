import { SaveQueryAsCollectionDialog } from '@/components/search/save-query-as-collection-dialog';
import { Button, Dialog, DialogTrigger } from '@intavia/ui';
import { useAllSearchResults } from '@/components/search/use-all-search-results';
import { useCollection } from '@/components/search/collection.context';
import { useAppDispatch } from '@/app/store';
import { addEntitiesToCollection } from '@/app/store/intavia-collections.slice';
import { useState } from 'react';

export function SearchResultsToolbar(): JSX.Element {
  const dispatch = useAppDispatch();
  const { currentCollection } = useCollection();
  const { getSearchResults } = useAllSearchResults();

  const [isDialogOpen, setDialogOpen] = useState(false);

  async function onAddQueryToCollection() {
    if (currentCollection == null) return;

    const { entities } = await getSearchResults();
    dispatch(addEntitiesToCollection({ id: currentCollection, entities }));
  }

  return (
    <div className="flex justify-between gap-2 border-b border-neutral-200 px-8 py-4">
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

      <Button
        disabled={currentCollection == null}
        onClick={onAddQueryToCollection}
        variant="outline"
      >
        Add query to collection
      </Button>
    </div>
  );
}
