import { TrashIcon } from '@heroicons/react/outline';
import type { Entity, EntityKind } from '@intavia/api-client';
import {
  Button,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@intavia/ui';
import { keyBy } from '@stefanprobst/key-by';
import { Fragment, useId, useMemo, useState } from 'react';
import { useField } from 'react-final-form';
import { useFieldArray } from 'react-final-form-arrays';

import {
  useSearchEventsQuery,
  useSearchOccupationsQuery,
  useSearchRelationRolesQuery,
} from '@/api/intavia.service';
import { useI18n } from '@/app/i18n/use-i18n';
import { useAppDispatch } from '@/app/store';
import { addLocalEntity } from '@/app/store/intavia.slice';
import { Form } from '@/components/form';
import { FormField } from '@/components/form-field';
import { LoadingIndicator } from '@/components/loading-indicator';
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
    onClose();

    dispatch(addLocalEntity(values));
  }

  const label = t(['common', 'entity', 'edit-entity'], {
    values: { kind: t(['common', 'entity', 'kinds', entity.kind, 'one']) },
  });

  return (
    <DialogContent className="sm:max-w-[620px]">
      <DialogHeader>
        <DialogTitle>{label}</DialogTitle>
        <DialogDescription>
          Edit entity details. Click save when you&apos;re done.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <Form id={formId} initialValues={entity} onSubmit={onSubmit}>
          <div className="grid gap-4">
            <EntityLabelTextField />
            <EntityDescriptionTextField />
            <EntityFormFields kind={entity.kind} />
            <RelationsFormFields />
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

function EntityLabelTextField(): JSX.Element {
  const name = 'label.default';

  const { t } = useI18n<'common'>();
  const field = useField(name);
  const id = useId();

  const label = t(['common', 'entity', 'label']);

  return (
    <FormField>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...field.input} required />
    </FormField>
  );
}

function EntityDescriptionTextField(): JSX.Element {
  const name = 'description';

  const { t } = useI18n<'common'>();
  const field = useField(name);
  const id = useId();

  const label = t(['common', 'entity', 'description']);

  return (
    <FormField>
      <Label htmlFor={id}>{label}</Label>
      <Textarea id={id} {...field.input} />
    </FormField>
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
      return (
        <Fragment>
          <GenderSelect />
          <OccupationsComboBox />
        </Fragment>
      );
    case 'place':
      return <Fragment></Fragment>;
  }
}

function GenderSelect(): JSX.Element {
  const name = 'gender';

  const { t } = useI18n<'common'>();
  const field = useField(name);
  const id = useId();

  const label = t(['common', 'entity', 'gender', 'one']);
  const placeholder = t(['common', 'entity', 'select-gender']);

  // FIXME: vocabs endpoint for gender?
  const genders = {
    'http://ldf.fi/schema/bioc/Female': { default: 'Female' },
    'http://ldf.fi/schema/bioc/Male': { default: 'Male' },
    'http://ldf.fi/schema/bioc/Unknown': { default: 'Unknown' },
  };

  /**
   *
   * Currently, the api returns full objects, so we need to populate the field with
   * full objects as well. Ideally, we only save the vocabulary entry id, and
   * look up a label from vocabularies in the store where needed.
   *
   * @see https://github.com/InTaVia/InTaVia-Backend/issues/131
   */

  const value = field.input.value.id;

  function onValueChange(id: keyof typeof genders) {
    const label = genders[id];
    field.input.onChange({ id, label });
  }

  return (
    <FormField>
      <Label htmlFor={id}>{label}</Label>
      <Select {...field.input} value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(genders).map(([id, label]) => {
            return (
              <SelectItem key={id} value={id}>
                {getTranslatedLabel(label)}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </FormField>
  );
}

// FIXME: multiselect combobox
// FIXME: allow creating new occupations (?)
function OccupationsComboBox(): JSX.Element {
  const name = 'occupations.0';

  const { t } = useI18n<'common'>();
  const field = useField(name);
  const id = useId();

  const label = t(['common', 'entity', 'occupation', 'other']);
  const placeholder = t(['common', 'entity', 'select-occupations']);

  const { data, isLoading } = useSearchOccupationsQuery({ limit: 10 });
  const occupations = useMemo(() => {
    const occupations = keyBy(data?.results ?? [], (item) => {
      return item.id;
    });
    const selected = field.input.value;
    if (selected != null && typeof selected === 'object') {
      occupations[selected.id] = selected;
    }
    return occupations;
  }, [data, field.input.value]);

  /**
   *
   * Currently, the api returns full objects, so we need to populate the field with
   * full objects as well. Ideally, we only save the vocabulary entry id, and
   * look up a label from vocabularies in the store where needed.
   *
   * @see https://github.com/InTaVia/InTaVia-Backend/issues/131
   */

  const value = field.input.value.id;

  function onValueChange(id: string) {
    const occupation = occupations[id];
    field.input.onChange(occupation);
  }

  return (
    <FormField>
      <Label htmlFor={id}>{label}</Label>
      <Select disabled={isLoading} {...field.input} value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id}>
          <div className="flex flex-1 items-center justify-between pr-2">
            <SelectValue placeholder={placeholder} />
            {isLoading ? <LoadingIndicator /> : null}
          </div>
        </SelectTrigger>
        <SelectContent>
          {Object.values(occupations).map((occupation) => {
            return (
              <SelectItem key={occupation.id} value={occupation.id}>
                {getTranslatedLabel(occupation.label)}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </FormField>
  );
}

function RelationsFormFields(): JSX.Element {
  const name = 'relations';

  const fieldArray = useFieldArray(name);

  return (
    <ul role="list">
      {fieldArray.fields.map((name, index) => {
        function onRemove() {
          fieldArray.fields.remove(index);
        }

        const role = [name, 'role'].join('.');
        const event = [name, 'event'].join('.');

        return (
          <li key={name}>
            <div className="grid grid-cols-[1fr_1fr_auto] items-end gap-2">
              <RelationRoleComboBox name={role} />
              <RelationEventComboBox name={event} />
              <Button className="h-10 w-10 p-1" variant="destructive" onClick={onRemove}>
                <span className="sr-only">Remove</span>
                <TrashIcon className="w-h w-5" />
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

interface RelationRoleComboBoxProps {
  name: string;
}

function RelationRoleComboBox(props: RelationRoleComboBoxProps) {
  const { name } = props;

  const field = useField(name);
  const id = useId();

  const { data } = useSearchRelationRolesQuery({ limit: 1000 });
  const roles = useMemo(() => {
    const values = data?.results ?? [];
    return values;
  }, [data]);

  return (
    <FormField>
      <Label htmlFor={id}>Role</Label>
      <Select {...field.input} onValueChange={field.input.onChange}>
        <SelectTrigger id={id}>
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => {
            return (
              <SelectItem key={role.id} value={role.id}>
                {getTranslatedLabel(role.label)}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </FormField>
  );
}

interface RelationEventComboBoxProps {
  name: string;
}

function RelationEventComboBox(props: RelationEventComboBoxProps) {
  const { name } = props;

  const field = useField(name);
  const id = useId();

  const [searchTerm] = useState('');
  const { data } = useSearchEventsQuery({ q: searchTerm });
  const events = useMemo(() => {
    const values = data?.results ?? [];
    return values;
  }, [data]);

  return (
    <FormField>
      <Label htmlFor={id}>Event</Label>
      <Select {...field.input} onValueChange={field.input.onChange}>
        <SelectTrigger id={id}>
          <SelectValue placeholder="Select event" />
        </SelectTrigger>
        <SelectContent>
          {events.map((event) => {
            return (
              <SelectItem key={event.id} value={event.id}>
                {getTranslatedLabel(event.label)}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </FormField>
  );
}
