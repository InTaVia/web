import { ChevronLeftIcon, ChevronRightIcon, PencilIcon, PlusIcon } from '@heroicons/react/outline';
import { XIcon } from '@heroicons/react/solid';
import type { EntityKind, MediaResource } from '@intavia/api-client';
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
  Dialog,
  DialogContent,
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
import { nanoid } from 'nanoid';
import type { ChangeEvent, ReactNode } from 'react';
import { Fragment, useId, useMemo, useState } from 'react';
import { useField } from 'react-final-form';
import { useFieldArray } from 'react-final-form-arrays';

import {
  useGetEventByIdQuery,
  useGetMediaResourceByIdQuery,
  useGetRelationRoleByIdQuery,
  useSearchEventsQuery,
  useSearchOccupationsQuery,
  useSearchRelationRolesQuery,
} from '@/api/intavia.service';
import { useI18n } from '@/app/i18n/use-i18n';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  addLocalMediaResource,
  selectEvents,
  selectMediaResourceById,
  selectVocabularyEntries,
} from '@/app/store/intavia.slice';
import { Form } from '@/components/form';
import { FormField } from '@/components/form-field';
import { NothingFoundMessage } from '@/components/nothing-found-message';
import { useDialogState } from '@/features/ui/use-dialog-state';
import { getTranslatedLabel } from '@/lib/get-translated-label';
import { isNonEmptyString } from '@/lib/is-nonempty-string';
import { useDebouncedValue } from '@/lib/use-debounced-value';

interface FormTextFieldProps {
  id: string;
  label: ReactNode;
  name: string;
  required?: boolean;
}

function FormTextField(props: FormTextFieldProps): JSX.Element {
  const { id, label, name, required = false } = props;

  const field = useField(name);

  return (
    <FormField>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...field.input} required={required} />
    </FormField>
  );
}

interface FormTextAreaFieldProps {
  id: string;
  label: ReactNode;
  name: string;
  required?: boolean;
}

function FormTextAreaField(props: FormTextAreaFieldProps): JSX.Element {
  const { id, label, name, required = false } = props;

  const field = useField(name);

  return (
    <FormField>
      <Label htmlFor={id}>{label}</Label>
      <Textarea id={id} {...field.input} required={required} />
    </FormField>
  );
}

export function EntityLabelTextField(): JSX.Element {
  const name = 'label.default';

  const { t } = useI18n<'common'>();
  const id = useId();

  const label = t(['common', 'entity', 'label']);

  return <FormTextField id={id} label={label} name={name} required />;
}

export function EntityAlternativeLabelFormFields(): JSX.Element {
  const name = 'alternativeLabels';

  const { t } = useI18n<'common'>();
  const fieldArray = useFieldArray(name);
  const id = useId();
  const label = t(['common', 'entity', 'alternative-label', 'other']);

  function onAdd() {
    fieldArray.fields.push({ default: undefined });
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
        <ul className="grid gap-2" role="list">
          {fieldArray.fields.map((_name, index) => {
            const name = [_name, 'default'].join('.');

            function onRemove() {
              fieldArray.fields.remove(index);
            }

            return (
              <li key={name}>
                <div className="grid grid-cols-[1fr_auto] items-end gap-2">
                  <FormTextField
                    id={id}
                    label={t(['common', 'entity', 'alternative-label', 'one'])}
                    name={name}
                    required
                  />
                  <IconButton
                    className="h-10 w-10"
                    label={t(['common', 'form', 'remove'])}
                    onClick={onRemove}
                    variant="outline"
                  >
                    <XIcon className="h-5 w-5 shrink-0" />
                  </IconButton>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <div className="flex items-center justify-end">
        <Button
          onClick={() => {
            onAdd();
          }}
          variant="default"
        >
          <PlusIcon className="mr-1 h-4 w-4 shrink-0" />
          <span>{t(['common', 'form', 'add'])}</span>
        </Button>
      </div>
    </div>
  );
}

export function EntityLinkedUriFormFields(): JSX.Element {
  const name = 'linkedIds';

  const { t } = useI18n<'common'>();
  const fieldArray = useFieldArray(name);
  const id = useId();
  const label = t(['common', 'entity', 'linked-url', 'other']);

  function onAdd() {
    fieldArray.fields.push(undefined);
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
        <ul className="grid gap-2" role="list">
          {fieldArray.fields.map((name, index) => {
            function onRemove() {
              fieldArray.fields.remove(index);
            }

            return (
              <li key={name}>
                <div className="grid grid-cols-[1fr_auto] items-end gap-2">
                  <FormTextField
                    id={id}
                    label={t(['common', 'entity', 'linked-url', 'one'])}
                    name={name}
                    required
                  />
                  <IconButton
                    className="h-10 w-10"
                    label={t(['common', 'form', 'remove'])}
                    onClick={onRemove}
                    variant="outline"
                  >
                    <XIcon className="h-5 w-5 shrink-0" />
                  </IconButton>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <div className="flex items-center justify-end">
        <Button
          onClick={() => {
            onAdd();
          }}
          variant="default"
        >
          <PlusIcon className="mr-1 h-4 w-4 shrink-0" />
          <span>{t(['common', 'form', 'add'])}</span>
        </Button>
      </div>
    </div>
  );
}

export function EntityDescriptionTextField(): JSX.Element {
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

export function EntityFormFields(props: EntityFormFieldsProps): JSX.Element {
  6;
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

export function GenderSelect(): JSX.Element {
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

  const pagination = usePaginationState(fieldArray.fields.length);

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
        <PaginatedFormFields pagination={pagination}>
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
                          variant="outline"
                        >
                          <XIcon className="h-5 w-5 shrink-0" />
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
        <Button
          onClick={() => {
            pagination.onLastPage();
            onAdd();
          }}
          variant="default"
        >
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
                className={cn(isFetching && 'opacity-50 neutralscale')}
                value={occupation.id}
              >
                {getTranslatedLabel(occupation.label)}
              </ComboBoxItem>
            );
          })}
          {data?.results.length === 0 ? (
            <ComboBoxEmpty className={cn(isFetching && 'opacity-50 neutralscale')}>
              Nothing found
            </ComboBoxEmpty>
          ) : null}
        </ComboBoxContent>
      </ComboBox>
    </FormField>
  );
}

export function RelationsFormFields(): JSX.Element {
  const name = 'relations';

  const { t } = useI18n<'common'>();
  const fieldArray = useFieldArray(name);
  const id = useId();

  const label = t(['common', 'entity', 'relation', 'other']);

  function onAdd() {
    fieldArray.fields.push({ event: undefined, role: undefined });
  }

  const pagination = usePaginationState(fieldArray.fields.length);

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
        <PaginatedFormFields pagination={pagination}>
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
                          variant="outline"
                        >
                          <XIcon className="h-5 w-5 shrink-0" />
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
        <Button
          onClick={() => {
            pagination.onLastPage();
            onAdd();
          }}
          variant="default"
        >
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
                className={cn(isFetching && 'opacity-50 neutralscale')}
              >
                {getTranslatedLabel(role.label)}
              </ComboBoxItem>
            );
          })}
          {data?.results.length === 0 ? (
            <ComboBoxEmpty className={cn(isFetching && 'opacity-50 neutralscale')}>
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
                className={cn(isFetching && 'opacity-50 neutralscale')}
              >
                {getTranslatedLabel(event.label)}
              </ComboBoxItem>
            );
          })}
          {data?.results.length === 0 ? (
            <ComboBoxEmpty className={cn(isFetching && 'opacity-50 neutralscale')}>
              Nothing found
            </ComboBoxEmpty>
          ) : null}
        </ComboBoxContent>
      </ComboBox>
    </FormField>
  );
}

interface PaginationState {
  page: number;
  pages: number;
  pageSize: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onFirstPage: () => void;
  onLastPage: () => void;
}

function usePaginationState(length = 0): PaginationState {
  const pageSize = 10;
  const pages = Math.ceil(length / pageSize) || 1;
  const [page, setPage] = useState(1);

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

  function onFirstPage() {
    setPage(1);
  }

  function onLastPage() {
    setPage(pages);
  }

  return { page, pages, pageSize, onPreviousPage, onNextPage, onFirstPage, onLastPage };
}

interface PaginatedFormFieldsProps {
  children: (pagination: PaginationState) => ReactNode;
  pagination: PaginationState;
}

function PaginatedFormFields(props: PaginatedFormFieldsProps): JSX.Element {
  const { children, pagination } = props;

  const { t } = useI18n<'common'>();
  const { page, pages, onPreviousPage, onNextPage } = pagination;

  if (pages <= 1) return <Fragment>{children(pagination)}</Fragment>;

  return (
    <div className="grid gap-4 text-sm">
      {children(pagination)}
      <nav
        className="flex flex-wrap items-start justify-between"
        aria-label={t(['common', 'pagination', 'pagination'])}
      >
        <span>{length} entries</span>
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

export function MediaFormFields(): JSX.Element {
  const name = 'media';

  const { t } = useI18n<'common'>();
  const fieldArray = useFieldArray(name);
  const id = useId();

  const dialog = useDialogState();

  return (
    <div aria-labelledby={id} role="group" className="grid gap-3">
      {fieldArray.fields.length === 0 ? (
        <div className="grid place-items-center py-2">
          <NothingFoundMessage className="text-sm" />
        </div>
      ) : (
        <ul className="grid divide-y" role="list">
          {fieldArray.fields.map((name, index) => {
            function onRemove() {
              fieldArray.fields.remove(index);
            }

            return <MediaResourceListItem key={name} name={name} onRemove={onRemove} />;
          })}
        </ul>
      )}

      <hr />

      <div className="flex items-center justify-end">
        <Button onClick={dialog.open} variant="default">
          <PlusIcon className="mr-1 h-4 w-4 shrink-0" />
          <span>{t(['common', 'form', 'add'])}</span>
        </Button>

        <Dialog open={dialog.isOpen} onOpenChange={dialog.toggle}>
          <MediaResourceFormDialog
            onClose={dialog.close}
            onSubmit={(values) => {
              fieldArray.fields.push(values.id);
            }}
          />
        </Dialog>
      </div>
    </div>
  );
}

interface MediaResourceListItemProps {
  name: string;
  onRemove: () => void;
}

function MediaResourceListItem(props: MediaResourceListItemProps): JSX.Element {
  const { name, onRemove } = props;

  const { t } = useI18n<'common'>();

  const field = useField(name);
  const id = field.input.value;

  const dialog = useDialogState();

  return (
    <li className="py-6 first-of-type:pt-0 last-of-type:pb-0" key={name}>
      <div className="grid grid-cols-[1fr_auto] items-end gap-2">
        <MediaResourcePreview name={name} />
        <div className="flex gap-2">
          <IconButton
            className="h-10 w-10"
            label={t(['common', 'form', 'edit'])}
            onClick={dialog.open}
            variant="outline"
          >
            <PencilIcon className="h-5 w-5 shrink-0" />
          </IconButton>
          <IconButton
            className="h-10 w-10"
            label={t(['common', 'form', 'remove'])}
            onClick={onRemove}
            variant="outline"
          >
            <XIcon className="h-5 w-5 shrink-0" />
          </IconButton>
        </div>
      </div>

      <Dialog open={dialog.isOpen} onOpenChange={dialog.toggle}>
        <MediaResourceFormDialog
          id={id}
          onClose={dialog.close}
          onSubmit={(values) => {
            field.input.onChange(values);
          }}
        />
      </Dialog>
    </li>
  );
}

function useMediaResource(id: string | undefined) {
  const _media = useAppSelector((state) => {
    if (id == null) return null;
    return selectMediaResourceById(state, id);
  });
  const query = useGetMediaResourceByIdQuery({ id: id! }, { skip: _media != null || id == null });

  if (id == null) return { status: 'idle', data: undefined };

  if (_media != null) return { status: 'success', data: _media };

  return { status: query.status, data: query.data };
}

interface MediaResourcePreview {
  name: string;
}

function MediaResourcePreview(props: MediaResourcePreview): JSX.Element {
  const { name } = props;

  const field = useField(name);
  const id = field.input.value;

  const query = useMediaResource(id);
  const media = query.data;

  if (query.status === 'fetching') {
    return (
      <div>
        <LoadingIndicator />
      </div>
    );
  }

  if (media == null) {
    return (
      <div>
        <NothingFoundMessage />
      </div>
    );
  }

  const label = getTranslatedLabel(media.label);

  return (
    <article className="grid gap-2">
      <span>{label}</span>
      {media.kind === 'image' ? (
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="h-56 w-full object-contain" src={media.url} />
          <figcaption>{media.attribution}</figcaption>
        </figure>
      ) : null}
      {media.kind === 'video' ? (
        <figure>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video className="h-56 w-full object-contain" src={media.url} />
          <figcaption>{media.attribution}</figcaption>
        </figure>
      ) : null}
      {media.kind === 'embed' ? (
        <figure>
          <iframe className="h-56 w-full object-contain" src={media.url} title={label} />
          <figcaption>{media.attribution}</figcaption>
        </figure>
      ) : null}
      {media.kind === 'document' ? (
        <div>
          <a href={media.url} download>
            {label}
          </a>
          <div>{media.attribution}</div>
        </div>
      ) : null}
      <div>{media.description}</div>
    </article>
  );
}

interface MediaResourceFormDialogProps {
  id?: string;
  onClose: () => void;
  onSubmit: (values: MediaResource) => void;
}

function MediaResourceFormDialog(props: MediaResourceFormDialogProps): JSX.Element {
  const { id, onClose } = props;

  const { t } = useI18n<'common'>();
  const dispatch = useAppDispatch();

  function onSubmit(values: MediaResource) {
    onClose();

    // @ts-expect-error It's ok to overwrite id if there is none.
    const resource = { id: nanoid(), ...values };

    dispatch(addLocalMediaResource(resource));

    props.onSubmit(resource);
  }

  const formId = 'entity-edit';

  const label = t(['common', 'entity', 'media', 'one']);

  const initialValues = useMediaResource(id).data;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{label}</DialogTitle>
      </DialogHeader>

      <MediaResourceForm id={formId} initialValues={initialValues} onSubmit={onSubmit} />

      <DialogFooter>
        <Button form={formId} type="submit">
          {t(['common', 'form', 'save'])}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

interface MediaResourceFormProps {
  id: string;
  initialValues?: MediaResource;
  onSubmit: (values: MediaResource) => void;
}

function MediaResourceForm(props: MediaResourceFormProps): JSX.Element {
  const { id, initialValues, onSubmit } = props;

  return (
    <Form className="grid gap-2" id={id} initialValues={initialValues} onSubmit={onSubmit}>
      <MediaResourceKindSelect name="kind" />
      <FormTextField id={useId()} label="URL" name="url" required />
      <FormTextField id={useId()} label="Label" name="label.default" required />
      <FormTextField id={useId()} label="Attribution" name="attribution" />
      <FormTextAreaField id={useId()} label="Description" name="description" />
    </Form>
  );
}

interface MediaResourceKindSelectProps {
  name: string;
}

function MediaResourceKindSelect(props: MediaResourceKindSelectProps): JSX.Element {
  const { name } = props;

  const id = useId();

  const { t } = useI18n<'common'>();

  const field = useField(name);

  const kinds = ['image', 'document', 'video'] as const;

  return (
    <FormField>
      <Label htmlFor={id}>{t(['common', 'entity', 'media-resource-kind', 'one'])}</Label>
      <Select {...field.input} onValueChange={field.input.onChange}>
        <SelectTrigger id={id}>
          <SelectValue placeholder={t(['common', 'entity', 'select-media-resource-kind'])} />
        </SelectTrigger>
        <SelectContent>
          {kinds.map((id) => {
            return (
              <SelectItem key={id} value={id}>
                {t(['common', 'media-resource-kind', id, 'one'])}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </FormField>
  );
}
