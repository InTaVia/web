import { TrashIcon } from '@heroicons/react/outline';
import { Button, Dialog, DialogTrigger } from '@intavia/ui';
import { useState } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { useAppDispatch } from '@/app/store';
import { removeCollection } from '@/app/store/intavia-collections.slice';
import { useCollection } from '@/components/search/collection.context';
import { CollectionSelect } from '@/components/search/collection-select';
import { CreateCollectionDialog } from '@/components/search/create-collection-dialog';

export function CollectionToolbar(): JSX.Element {
  const { t } = useI18n<'common'>();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const { currentCollection, setCurrentCollection } = useCollection();
  const dispatch = useAppDispatch();

  function onDeleteCollection() {
    if (currentCollection == null) return;

    setCurrentCollection(null);
    dispatch(removeCollection({ id: currentCollection }));
  }

  return (
    <div className="flex flex-col justify-between gap-2 border-b border-neutral-200 px-8 py-4 lg:flex-row">
      <CollectionSelect />

      <div className="flex items-center justify-between gap-2">
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">{t(['common', 'collections', 'create-collection'])}</Button>
          </DialogTrigger>
          <CreateCollectionDialog
            onClose={() => {
              setDialogOpen(false);
            }}
          />
        </Dialog>

        <Button
          className="h-10 w-10 p-1"
          disabled={currentCollection == null}
          onClick={onDeleteCollection}
          title="Delete collection"
          variant="destructive"
        >
          <TrashIcon className="h-5 w-5" />
          <span className="sr-only">Delete collection</span>
        </Button>
      </div>
    </div>
  );
}
