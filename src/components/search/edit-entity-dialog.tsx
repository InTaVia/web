import { TrashIcon } from '@heroicons/react/outline';
import type { Entity, EntityKind } from '@intavia/api-client';
import {
  Button,
  ComboBox,
  ComboBoxContent,
  ComboBoxInput,
  ComboBoxItem,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  IconButton,
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
import { ChangeEvent, Fragment, useId, useMemo, useState } from 'react';
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
import { getTranslatedLabel } from '@/lib/get-translated-label';
import { useDebouncedValue } from '@/lib/use-debounced-value';

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

  const [searchTerm, setSearchTerm] = useState('');
  const q = useDebouncedValue(searchTerm.trim());
  const { data, isLoading } = useSearchOccupationsQuery({ q });
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

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.currentTarget.value);
  }

  return (
    <FormField>
      <Label htmlFor={id}>{label}</Label>
      <ComboBox disabled={isLoading} onValueChange={onValueChange} value={value}>
        <ComboBoxInput id={id} onChange={onInputChange} placeholder={placeholder} />
        <ComboBoxContent>
          {Object.values(occupations).map((occupation) => {
            return (
              <ComboBoxItem key={occupation.id} value={occupation.id}>
                {getTranslatedLabel(occupation.label)}
              </ComboBoxItem>
            );
          })}
        </ComboBoxContent>
      </ComboBox>
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
              <IconButton
                className="h-10 w-10"
                label="Remove"
                onClick={onRemove}
                variant="destructive"
              >
                <TrashIcon className="h-5 w-5 shrink-0" />
              </IconButton>
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

  const [searchTerm, setSearchTerm] = useState('');
  const q = useDebouncedValue(searchTerm.trim());
  const { data } = useSearchRelationRolesQuery({ q });
  const roles = useMemo(() => {
    const roles = keyBy(data?.results ?? [], (role) => {
      return role.id;
    });
    const selected = field.input.value;
    if (selected != null && typeof selected === 'object') {
      roles[selected.id] = selected;
    }
    return roles;
  }, [data, field.input.value]);

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.currentTarget.value);
  }

  return (
    <FormField>
      <Label htmlFor={id}>Role</Label>
      <ComboBox onValueChange={field.input.onChange} value={field.input.value}>
        <ComboBoxInput id={id} onChange={onInputChange} placeholder="Select role" />
        <ComboBoxContent>
          {Object.values(roles).map((role) => {
            return (
              <ComboBoxItem key={role.id} value={role.id}>
                {getTranslatedLabel(role.label)}
              </ComboBoxItem>
            );
          })}
        </ComboBoxContent>
      </ComboBox>
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

  const [searchTerm, setSearchTerm] = useState('');
  const q = useDebouncedValue(searchTerm.trim());
  const { data } = useSearchEventsQuery({ q });
  const events = useMemo(() => {
    const events = keyBy(data?.results ?? [], (event) => {
      return event.id;
    });
    const selected = field.input.value;
    if (selected != null && typeof selected === 'object') {
      events[selected.id] = selected;
    }
    return events;
  }, [data, field.input.value]);

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.currentTarget.value);
  }

  return (
    <FormField>
      <Label htmlFor={id}>Event</Label>
      <ComboBox onValueChange={field.input.onChange} value={field.input.value}>
        <ComboBoxInput id={id} onChange={onInputChange} placeholder="Select event" />
        <ComboBoxContent>
          {Object.values(events).map((event) => {
            return (
              <ComboBoxItem key={event.id} value={event.id}>
                {getTranslatedLabel(event.label)}
              </ComboBoxItem>
            );
          })}
        </ComboBoxContent>
      </ComboBox>
    </FormField>
  );
}
