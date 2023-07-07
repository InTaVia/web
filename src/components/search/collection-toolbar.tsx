import {
  AlertDialog,
  AlertDialogTrigger,
  Button,
  Dialog,
  DialogTrigger,
  IconButton,
} from '@intavia/ui';
import { Trash2Icon } from 'lucide-react';
import { useState } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { removeCollection, selectCollections } from '@/app/store/intavia-collections.slice';
import { useCollection } from '@/components/search/collection.context';
import { CollectionSelect } from '@/components/search/collection-select';
import { CreateCollectionDialog } from '@/components/search/create-collection-dialog';
import { DeleteCollectionAlertDialog } from '@/components/search/delete-collection-alert';

export function CollectionToolbar(): JSX.Element {
  const { t } = useI18n<'common'>();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isAlertDialogOpen, setAlertDialogOpen] = useState(false);

  const collections = useAppSelector(selectCollections);
  const { currentCollection, setCurrentCollection } = useCollection();
  const dispatch = useAppDispatch();

  const currentCollectionLabel =
    currentCollection != null ? collections[currentCollection]?.label : null;
  const currentCollectionEntityCount =
    currentCollection != null ? collections[currentCollection]?.entities.length : 0;

  function onDeleteCollection() {
    if (currentCollection == null) return;

    setCurrentCollection(null);
    dispatch(removeCollection({ id: currentCollection }));
    setAlertDialogOpen(false);
  }

  return (
    <div className="flex flex-col justify-between gap-2 border-b border-neutral-200 px-8 py-3 lg:flex-row">
      <CollectionSelect />

      <div className="flex items-center justify-between gap-2">
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="subtle">{t(['common', 'collections', 'create-collection'])}</Button>
          </DialogTrigger>
          <CreateCollectionDialog
            onClose={() => {
              setDialogOpen(false);
            }}
          />
        </Dialog>

        <AlertDialog open={isAlertDialogOpen} onOpenChange={setAlertDialogOpen}>
          <AlertDialogTrigger asChild>
            <IconButton
              className="h-10 w-10"
              disabled={currentCollection == null}
              label="Delete collection"
              variant="destructive"
            >
              <Trash2Icon className="h-5 w-5 shrink-0" />
            </IconButton>
          </AlertDialogTrigger>

          <DeleteCollectionAlertDialog
            onDelete={onDeleteCollection}
            label={currentCollectionLabel ?? ''}
            count={String(currentCollectionEntityCount)}
          />
        </AlertDialog>
      </div>
    </div>
  );
}
