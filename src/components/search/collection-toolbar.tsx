import { Button, Dialog, DialogTrigger } from '@intavia/ui';
import { useState } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { CollectionSelect } from '@/components/search/collection-select';
import { CreateCollectionDialog } from '@/components/search/create-collection-dialog';

export function CollectionToolbar(): JSX.Element {
  const { t } = useI18n<'common'>();

  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="flex justify-between gap-2 border-b border-neutral-200 px-8 py-4">
      <CollectionSelect />

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
    </div>
  );
}
