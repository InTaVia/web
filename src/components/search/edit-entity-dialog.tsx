import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, TrashIcon } from '@heroicons/react/outline';
import type { Entity, EntityKind } from '@intavia/api-client';
import {
  Button,
  cn,
  ComboBox,
  ComboBoxButton,
  ComboBoxContent,
  ComboBoxEmpty,
  ComboBoxInput,
  ComboBoxItem,
  ComboBoxTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  IconButton,
  Input,
  Label,
  LoadingIndicator,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@intavia/ui';
import { keyBy } from '@stefanprobst/key-by';
import type { ChangeEvent, ReactNode } from 'react';
import { Fragment, useId, useMemo, useState } from 'react';
import { useField } from 'react-final-form';
import { useFieldArray } from 'react-final-form-arrays';

import {
  useGetEventByIdQuery,
  useGetRelationRoleByIdQuery,
  useSearchEventsQuery,
  useSearchOccupationsQuery,
  useSearchRelationRolesQuery,
} from '@/api/intavia.service';
import { useI18n } from '@/app/i18n/use-i18n';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { addLocalEntity, selectEvents, selectVocabularyEntries } from '@/app/store/intavia.slice';
import { Form } from '@/components/form';
import { FormField } from '@/components/form-field';
import { NothingFoundMessage } from '@/components/nothing-found-message';
import { getTranslatedLabel } from '@/lib/get-translated-label';
import { isNonEmptyString } from '@/lib/is-nonempty-string';
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

    const sanitized = {
      ...values,
      relations: values.relations.filter((relation) => {
        return isNonEmptyString(relation.event) && isNonEmptyString(relation.role);
      }),
    };

    if (sanitized.kind === 'person' && Array.isArray(sanitized.occupations)) {
      sanitized.occupations = sanitized.occupations.filter((occupation) => {
        return isNonEmptyString(occupation.id);
      });
    }

    dispatch(addLocalEntity(sanitized));
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

      <div className="-mx-4 grid gap-4 overflow-y-auto p-4">
        <Form id={formId} initialValues={entity} onSubmit={onSubmit}>
          <div className="grid gap-4">
            <EntityLabelTextField />
            <EntityDescriptionTextField />
            <EntityFormFields kind={entity.kind} />
            <hr />
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
          <hr />
          <OccupationsFormFields />
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

function OccupationsFormFields(): JSX.Element {
  const name = 'occupations';

  const { t } = useI18n<'common'>();
  const fieldArray = useFieldArray(name);
  const id = useId();
  const label = t(['common', 'entity', 'occupation', 'other']);

  function onAdd() {
    fieldArray.fields.push({ id: undefined });
  }

  return (
    <div aria-labelledby={id} role="group" className="grid gap-3">
      <span className="text-sm font-medium" id={id}>
        {label}
      </span>
      {fieldArray.fields.length === 0 ? (
        <div className="grid place-items-center py-2">
          <NothingFoundMessage className="text-sm" />
        </div>
      ) : (
        <PaginatedFormFields length={fieldArray.fields.length}>
          {({ page, pageSize }) => {
            const start = (page - 1) * pageSize;
            const end = page * pageSize;

            return (
              <ul className="grid gap-3" role="list">
                {fieldArray.fields.map((name, index) => {
                  if (index < start || index >= end) return null;

                  function onRemove() {
                    fieldArray.fields.remove(index);
                  }

                  return (
                    <li key={name}>
                      <div className="grid grid-cols-[1fr_auto] items-end gap-2">
                        <OccupationComboBox name={name} />
                        <IconButton
                          className="h-10 w-10"
                          label={t(['common', 'form', 'remove'])}
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
          }}
        </PaginatedFormFields>
      )}
      <div className="flex items-center justify-end">
        <Button onClick={onAdd} variant="outline">
          <PlusIcon className="mr-1 h-4 w-4 shrink-0" />
          <span>{t(['common', 'form', 'add'])}</span>
        </Button>
      </div>
    </div>
  );
}

interface OccupationComboBoxProps {
  name: string;
}

function OccupationComboBox(props: OccupationComboBoxProps): JSX.Element {
  const { name } = props;

  const { t } = useI18n<'common'>();
  const field = useField(name);
  const id = useId();

  const selected = field.input.value;
  /**
   *
   * Currently, the api returns full objects, so we need to populate the field with
   * full objects as well. Ideally, we only save the vocabulary entry id, and
   * look up a label from vocabularies in the store where needed.
   *
   * @see https://github.com/InTaVia/InTaVia-Backend/issues/131
   */

  const value = selected.id;

  const label = t(['common', 'entity', 'occupation', 'one']);
  const placeholder = t(['common', 'entity', 'select-occupations']);

  const [searchTerm, setSearchTerm] = useState('');
  const q = useDebouncedValue(searchTerm.trim());
  const { data, isFetching, isLoading } = useSearchOccupationsQuery({ q });
  const occupations = useMemo(() => {
    const occupations = keyBy(data?.results ?? [], (item) => {
      return item.id;
    });
    if (selected != null && selected.id != null) {
      occupations[selected.id] = selected;
    }
    return occupations;
  }, [data, selected]);

  function onValueChange(id: string) {
    const occupation = occupations[id];
    field.input.onChange(occupation);
  }

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.currentTarget.value);
  }

  function getDisplayLabel(id: string) {
    const occupation = occupations[id];
    if (occupation == null) return '';
    return getTranslatedLabel(occupation.label);
  }

  return (
    <FormField>
      <Label htmlFor={id}>{label}</Label>
      <ComboBox disabled={isLoading} onValueChange={onValueChange} value={value}>
        <ComboBoxTrigger>
          <ComboBoxInput
            displayValue={getDisplayLabel}
            id={id}
            onChange={onInputChange}
            placeholder={placeholder}
          />
          {isFetching ? <LoadingIndicator className="mr-4 text-neutral-500" size="sm" /> : null}
          <ComboBoxButton />
        </ComboBoxTrigger>
        <ComboBoxContent>
          {Object.values(occupations).map((occupation) => {
            return (
              <ComboBoxItem
                key={occupation.id}
                className={cn(isFetching && 'opacity-50 grayscale')}
                value={occupation.id}
              >
                {getTranslatedLabel(occupation.label)}
              </ComboBoxItem>
            );
          })}
          {data?.results.length === 0 ? (
            <ComboBoxEmpty className={cn(isFetching && 'opacity-50 grayscale')}>
              Nothing found
            </ComboBoxEmpty>
          ) : null}
        </ComboBoxContent>
      </ComboBox>
    </FormField>
  );
}

function RelationsFormFields(): JSX.Element {
  const name = 'relations';

  const { t } = useI18n<'common'>();
  const fieldArray = useFieldArray(name);
  const id = useId();

  const label = t(['common', 'entity', 'relation', 'other']);

  function onAdd() {
    fieldArray.fields.push({ event: undefined, role: undefined });
  }

  return (
    <div aria-labelledby={id} role="group" className="grid gap-3">
      <span className="text-sm font-medium" id={id}>
        {label}
      </span>
      {fieldArray.fields.length === 0 ? (
        <div className="grid place-items-center py-2">
          <NothingFoundMessage className="text-sm" />
        </div>
      ) : (
        <PaginatedFormFields length={fieldArray.fields.length}>
          {({ page, pageSize }) => {
            const start = (page - 1) * pageSize;
            const end = page * pageSize;

            return (
              <ul className="grid gap-3" role="list">
                {fieldArray.fields.map((name, index) => {
                  if (index < start || index >= end) return null;

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
                          label={t(['common', 'form', 'remove'])}
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
          }}
        </PaginatedFormFields>
      )}
      <div className="flex items-center justify-end">
        <Button onClick={onAdd} variant="outline">
          <PlusIcon className="mr-1 h-4 w-4 shrink-0" />
          <span>{t(['common', 'form', 'add'])}</span>
        </Button>
      </div>
    </div>
  );
}

interface RelationRoleComboBoxProps {
  name: string;
}

function RelationRoleComboBox(props: RelationRoleComboBoxProps) {
  const { name } = props;

  const field = useField(name);
  const id = useId();

  const hasSelection = isNonEmptyString(field.input.value);
  const storedRoles = useAppSelector(selectVocabularyEntries);
  const selectedRoleFromStore = hasSelection ? storedRoles[field.input.value] : undefined;
  const { data: selectedRoleFrombackend } = useGetRelationRoleByIdQuery(
    { id: field.input.value },
    { skip: !hasSelection || selectedRoleFromStore != null },
  );
  const selected = selectedRoleFromStore ?? selectedRoleFrombackend;

  const [searchTerm, setSearchTerm] = useState('');
  const q = useDebouncedValue(searchTerm.trim());
  const { data, isLoading, isFetching } = useSearchRelationRolesQuery({ q });
  const roles = useMemo(() => {
    const roles = keyBy(data?.results ?? [], (role) => {
      return role.id;
    });
    if (selected != null) {
      roles[selected.id] = selected;
    }
    return roles;
  }, [data, selected]);

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.currentTarget.value);
  }

  function getDisplayLabel(id: string) {
    const role = roles[id];
    if (role == null) return '';
    return getTranslatedLabel(role.label);
  }

  return (
    <FormField>
      <Label htmlFor={id}>Role</Label>
      <ComboBox disabled={isLoading} onValueChange={field.input.onChange} value={field.input.value}>
        <ComboBoxTrigger>
          <ComboBoxInput
            displayValue={getDisplayLabel}
            id={id}
            onChange={onInputChange}
            placeholder="Select role"
          />
          {isFetching ? <LoadingIndicator className="mr-4 text-neutral-500" size="sm" /> : null}
          <ComboBoxButton />
        </ComboBoxTrigger>
        <ComboBoxContent>
          {Object.values(roles).map((role) => {
            return (
              <ComboBoxItem
                key={role.id}
                value={role.id}
                className={cn(isFetching && 'opacity-50 grayscale')}
              >
                {getTranslatedLabel(role.label)}
              </ComboBoxItem>
            );
          })}
          {data?.results.length === 0 ? (
            <ComboBoxEmpty className={cn(isFetching && 'opacity-50 grayscale')}>
              Nothing found
            </ComboBoxEmpty>
          ) : null}
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

  const hasSelection = isNonEmptyString(field.input.value);
  const storedEvents = useAppSelector(selectEvents);
  const selectedEventFromStore = hasSelection ? storedEvents[field.input.value] : undefined;
  const { data: selectedEventFromBackend } = useGetEventByIdQuery(
    { id: field.input.value },
    { skip: !hasSelection || selectedEventFromStore != null },
  );
  const selected = selectedEventFromStore ?? selectedEventFromBackend;

  const [searchTerm, setSearchTerm] = useState('');
  const q = useDebouncedValue(searchTerm.trim());
  const { data, isLoading, isFetching } = useSearchEventsQuery({ q });
  const events = useMemo(() => {
    const events = keyBy(data?.results ?? [], (event) => {
      return event.id;
    });
    if (selected != null) {
      events[selected.id] = selected;
    }
    return events;
  }, [data, selected]);

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.currentTarget.value);
  }

  function getDisplayLabel(id: string) {
    const event = events[id];
    if (event == null) return '';
    return getTranslatedLabel(event.label);
  }

  return (
    <FormField>
      <Label htmlFor={id}>Event</Label>
      <ComboBox disabled={isLoading} onValueChange={field.input.onChange} value={field.input.value}>
        <ComboBoxTrigger>
          <ComboBoxInput
            displayValue={getDisplayLabel}
            id={id}
            onChange={onInputChange}
            placeholder="Select event"
          />
          {isFetching ? <LoadingIndicator className="mr-4 text-neutral-500" size="sm" /> : null}
          <ComboBoxButton />
        </ComboBoxTrigger>
        <ComboBoxContent>
          {Object.values(events).map((event) => {
            return (
              <ComboBoxItem
                key={event.id}
                value={event.id}
                className={cn(isFetching && 'opacity-50 grayscale')}
              >
                {getTranslatedLabel(event.label)}
              </ComboBoxItem>
            );
          })}
          {data?.results.length === 0 ? (
            <ComboBoxEmpty className={cn(isFetching && 'opacity-50 grayscale')}>
              Nothing found
            </ComboBoxEmpty>
          ) : null}
        </ComboBoxContent>
      </ComboBox>
    </FormField>
  );
}

interface PaginatedFormFieldsProps {
  children: (pagination: { page: number; pageSize: number }) => ReactNode;
  length: number | undefined;
}

function PaginatedFormFields(props: PaginatedFormFieldsProps): JSX.Element {
  const { children, length = 0 } = props;

  const { t } = useI18n<'common'>();

  const pageSize = 10;
  const pages = Math.ceil(length / pageSize);
  const [page, setPage] = useState(1);

  if (pages === 1) {
    return <Fragment>{children({ page, pageSize })}</Fragment>;
  }

  function onPreviousPage() {
    if (page > 1) {
      setPage(page - 1);
    }
  }

  function onNextPage() {
    if (page < pages) {
      setPage(page + 1);
    }
  }

  return (
    <div className="grid gap-4">
      {children({ page, pageSize })}
      <nav
        className="flex flex-wrap items-start justify-between"
        aria-label={t(['common', 'pagination', 'pagination'])}
      >
        <span>{length} relations</span>
        <div className="flex flex-wrap items-center gap-4">
          <button
            className="flex items-center gap-1 disabled:cursor-not-allowed disabled:text-neutral-500"
            disabled={page <= 1}
            onClick={onPreviousPage}
            type="button"
          >
            <ChevronLeftIcon className="h-4 w-4 shrink-0" />
            {t(['common', 'pagination', 'go-to-previous-page'])}
          </button>
          <button
            className="flex items-center gap-1 disabled:cursor-not-allowed disabled:text-neutral-500"
            disabled={page >= pages}
            onClick={onNextPage}
            type="button"
          >
            {t(['common', 'pagination', 'go-to-next-page'])}
            <ChevronRightIcon className="h-4 w-4 shrink-0" />
          </button>
        </div>
      </nav>
    </div>
  );
}
