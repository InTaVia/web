import {
  Button,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@intavia/ui';

import { useI18n } from '@/app/i18n/use-i18n';
import { useAppDispatch } from '@/app/store';
import { addCollection, createCollection } from '@/app/store/intavia-collections.slice';
import { Form } from '@/components/form/form';
import { FormTextField } from '@/components/form/form-text-field';
import { useAllSearchResults } from '@/components/search/use-all-search-results';

interface SaveQueryAsCollectionDialogProps {
  onClose: () => void;
}

export function SaveQueryAsCollectionDialog(props: SaveQueryAsCollectionDialogProps): JSX.Element {
  const { onClose } = props;

  const formId = 'save-collection';

  const { t } = useI18n<'common'>();

  const dispatch = useAppDispatch();

  const { getSearchResults } = useAllSearchResults();

  async function onSubmit(values: { label: string }) {
    onClose();

    const { entities, metadata } = await getSearchResults();
    const collection = createCollection({ ...values, entities, metadata });
    dispatch(addCollection(collection));
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{t(['common', 'collections', 'create-collection'])}</DialogTitle>
        <DialogDescription>
          Provide a name for the collection. Click save when you&apos;re done.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <Form id={formId} onSubmit={onSubmit}>
          <FormTextField
            label={t(['common', 'collections', 'collection-name'])}
            name="label"
            required
          />
        </Form>
      </div>

      <DialogFooter>
        <Button form={formId} type="submit">
          {t(['common', 'form', 'save'])}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
