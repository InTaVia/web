import type { Entity } from '@intavia/api-client';
import {
  Button,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@intavia/ui';
import { useId } from 'react';
import { useField } from 'react-final-form';

import { useI18n } from '@/app/i18n/use-i18n';
import { useAppDispatch, useAppSelector } from '@/app/store';
import type { Collection } from '@/app/store/intavia-collections.slice';
import { addEntitiesToCollection, selectCollections } from '@/app/store/intavia-collections.slice';
import { Form } from '@/components/form';
import { FormField } from '@/components/form-field';

interface AddToCollectionDialogProps {
  entity: Entity;
  onClose: () => void;
}

export function AddToCollectionDialog(props: AddToCollectionDialogProps): JSX.Element {
  const { entity, onClose } = props;

  const dispatch = useAppDispatch();

  const formId = 'add-to-collection';

  function onSubmit(values: { collection: Collection['id'] }) {
    onClose();

    dispatch(addEntitiesToCollection({ id: values.collection, entities: [entity.id] }));
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add to collection</DialogTitle>
        <DialogDescription>Add {entity.label.default} to a collection.</DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <Form id={formId} onSubmit={onSubmit}>
          <CollectionSelectField />
        </Form>
      </div>
      <DialogFooter>
        <Button form={formId} type="submit">
          Add
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

function CollectionSelectField(): JSX.Element {
  const name = 'collection';

  const { t } = useI18n<'common'>();

  const field = useField(name);
  const value = field.input.value.id;
  const id = useId();

  const _collections = useAppSelector(selectCollections);
  const collections = Object.values(_collections);

  function onSelectionChange(id: string) {
    field.input.onChange(id);
  }

  return (
    <FormField>
      <Label htmlFor={id}>Collection</Label>
      <Select {...field.input} value={value} onValueChange={onSelectionChange}>
        <SelectTrigger id={id} className="w-[180px]">
          <SelectValue placeholder={t(['common', 'collections', 'select-collection'])} />
        </SelectTrigger>
        <SelectContent>
          {collections.map((collection) => {
            return (
              <SelectItem key={collection.id} value={collection.id}>
                {collection.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </FormField>
  );
}
