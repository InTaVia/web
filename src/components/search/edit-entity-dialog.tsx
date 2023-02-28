import type { Entity, EntityKind } from '@intavia/api-client';
import {
  Button,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@intavia/ui';
import { Fragment } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { useAppDispatch } from '@/app/store';
import { addLocalEntity } from '@/app/store/intavia.slice';
import { Form } from '@/components/form/form';
import { FormSelect } from '@/components/form/form-select';
import { FormTextField } from '@/components/form/form-text-field';
import { getTranslatedLabel } from '@/lib/get-translated-label';

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
          <div className="grid gap-4">
            <FormTextField label={t(['common', 'entity', 'label'])} name="label.default" />
            <EntityFormFields kind={entity.kind} />
          </div>
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

  const { t } = useI18n<'common'>();

  // FIXME: vocabs endpoint for gender?
  const genders = [
    { id: 'http://ldf.fi/schema/bioc/Female', label: { default: 'Female' } },
    { id: 'http://ldf.fi/schema/bioc/Male', label: { default: 'Male' } },
  ];

  switch (kind) {
    case 'cultural-heritage-object':
      return <Fragment></Fragment>;
    case 'group':
      return <Fragment></Fragment>;
    case 'historical-event':
      return <Fragment></Fragment>;
    case 'person':
      return (
        <Fragment>
          <FormSelect label={t(['common', 'entity', 'gender', 'one'])} name="gender.id">
            <SelectTrigger>
              <SelectValue placeholder={t(['common', 'collections', 'select-collection'])} />
            </SelectTrigger>
            <SelectContent>
              {genders.map((gender) => {
                return (
                  <SelectItem key={gender.id} value={gender.id}>
                    {getTranslatedLabel(gender.label)}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </FormSelect>
        </Fragment>
      );
    case 'place':
      return <Fragment></Fragment>;
  }
}
