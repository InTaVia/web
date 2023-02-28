import type { Entity, EntityKind } from '@intavia/api-client';
import {
  Button,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@intavia/ui';
import { Fragment } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { useAppDispatch } from '@/app/store';
import { addLocalEntity } from '@/app/store/intavia.slice';
import { Form } from '@/components/form/form';
import { FormTextField } from '@/components/form/form-text-field';

interface EditEntityDialogProps<T extends Entity> {
  entity: T;
  onClose: () => void;
}

export function EditEntityDialog<T extends Entity>(props: EditEntityDialogProps<T>): JSX.Element {
  const { entity, onClose } = props;

  const formId = 'edit-entity';

  const { t } = useI18n<'common'>();

  const dispatch = useAppDispatch();

  function onSubmit(values: T) {
    dispatch(addLocalEntity(values));

    onClose();
  }

  const label = t(['common', 'entity', 'edit-entity'], {
    values: { kind: t(['common', 'entity', 'kinds', entity.kind, 'one']) },
  });

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{label}</DialogTitle>
        <DialogDescription>
          Edit entity details. Click save when you&apos;re done.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <Form id={formId} initialValues={entity} onSubmit={onSubmit}>
          <FormTextField label={t(['common', 'entity', 'label'])} name="label.default" />

          <EntityFormFields kind={entity.kind} />
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

interface EntityFormFieldsProps {
  kind: EntityKind;
}

function EntityFormFields(props: EntityFormFieldsProps): JSX.Element {
  const { kind } = props;

  switch (kind) {
    case 'cultural-heritage-object':
      return <Fragment></Fragment>;
    case 'group':
      return <Fragment></Fragment>;
    case 'historical-event':
      return <Fragment></Fragment>;
    case 'person':
      return <Fragment></Fragment>;
    case 'place':
      return <Fragment></Fragment>;
  }
}
