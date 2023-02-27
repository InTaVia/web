import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@intavia/ui';
import { useState } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { useAppDispatch } from '@/app/store';
import { addCollection, createCollection } from '@/app/store/intavia-collections.slice';
import { Form } from '@/components/form/form';
import { FormTextField } from '@/components/form/form-text-field';

interface CreateCollectionDialogProps {
  children: JSX.Element;
}

export function CreateCollectionDialog(props: CreateCollectionDialogProps): JSX.Element {
  const { children } = props;

  const formId = 'save-collection';

  const { t } = useI18n<'common'>();

  const dispatch = useAppDispatch();
  const [isDialogOpen, setDialogOpen] = useState(false);

  function onSubmit(values: { label: string }) {
    dispatch(addCollection(createCollection(values)));

    setDialogOpen(false);
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

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
    </Dialog>
  );
}
