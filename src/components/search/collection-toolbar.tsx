import { Button } from '@intavia/ui';

import { useI18n } from '@/app/i18n/use-i18n';
import { CollectionSelect } from '@/components/search/collection-select';
import { CreateCollectionDialog } from '@/components/search/create-collection-dialog';

export function CollectionToolbar(): JSX.Element {
  const { t } = useI18n<'common'>();

  return (
    <div className="flex justify-between gap-2 border-b border-neutral-200 px-8 py-4">
      <CollectionSelect />

      <CreateCollectionDialog>
        <Button variant="outline">{t(['common', 'collections', 'create-collection'])}</Button>
      </CreateCollectionDialog>
    </div>
  );
}
