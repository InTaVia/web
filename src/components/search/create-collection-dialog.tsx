import {
  Button,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from '@intavia/ui';
import { useField } from 'react-final-form';

import { useI18n } from '@/app/i18n/use-i18n';
import { useAppDispatch } from '@/app/store';
import { addCollection, createCollection } from '@/app/store/intavia-collections.slice';
import { Form } from '@/components/form';
import { FormField } from '@/components/form-field';

interface CreateCollectionDialogProps {
  onClose: () => void;
}

export function CreateCollectionDialog(props: CreateCollectionDialogProps): JSX.Element {
  const { onClose } = props;

  const formId = 'save-collection';

  const { t } = useI18n<'common'>();

  const dispatch = useAppDispatch();

  function onSubmit(values: { label: string }) {
    onClose();

    const collection = createCollection(values);
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
          <CollectionNameTextField />
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

function CollectionNameTextField(): JSX.Element {
  const name = 'label';

  const { t } = useI18n<'common'>();
  const field = useField(name);

  const id = name;
  const label = t(['common', 'collections', 'collection-name']);

  return (
    <FormField>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...field.input} required />
    </FormField>
  );
}
