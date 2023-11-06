import { ChevronLeftIcon, ChevronRightIcon, PencilIcon, PlusIcon } from '@heroicons/react/outline';
import { XIcon } from '@heroicons/react/solid';
import type {
  Biography,
  Entity,
  EntityEventRelation,
  EntityKind,
  EntityRelationRole,
  Event,
  MediaResource,
} from '@intavia/api-client';
import { entityKinds } from '@intavia/api-client';
import {
  Button,
  cn,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
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
  useGetBiographyByIdQuery,
  useGetEventByIdQuery,
  useGetEventKindByIdQuery,
  useGetMediaResourceByIdQuery,
  useGetRelationRoleByIdQuery,
  useSearchEntitiesQuery,
  useSearchEventKindsQuery,
  useSearchEventsQuery,
  useSearchOccupationsQuery,
  useSearchRelationRolesQuery,
} from '@/api/intavia.service';
import { useI18n } from '@/app/i18n/use-i18n';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  addLocalBiography,
  addLocalEntity,
  addLocalEvent,
  addLocalMediaResource,
  addLocalVocabulary,
  selectBiographyById,
  selectEntities,
  selectEventById,
  selectLocalEntities,
  selectLocalVocabularyById,
  selectMediaResourceById,
  selectVocabularyEntryById,
} from '@/app/store/intavia.slice';
import { Form } from '@/components/form';
import { FormField } from '@/components/form-field';
import { NothingFoundMessage } from '@/components/nothing-found-message';
import { NoDateQualityIndicator } from '@/features/common/quality-indicators';
import { useDialogState } from '@/features/ui/use-dialog-state';
import { getTranslatedLabel } from '@/lib/get-translated-label';
import { isNonEmptyString } from '@/lib/is-nonempty-string';
import { useDebouncedValue } from '@/lib/use-debounced-value';
import { useEntities } from '@/lib/use-entities';
import { useEntity } from '@/lib/use-entity';
import { useEntityEvent } from '@/lib/use-entity-event';
import { useRelationRoles } from '@/lib/use-relation-roles';

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
    fieldArray.fields.push({ url: null, label: null });
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

            const url = [name, 'url'].join('.');
            const label = [name, 'label'].join('.');

            return (
              <li key={name}>
                <div className="grid grid-cols-[1fr_1fr_auto] items-end gap-2">
                  <FormTextField
                    id={id}
                    label={t(['common', 'entity', 'linked-url', 'one'])}
                    name={url}
                    required
                  />
                  <FormTextField
                    id={id}
                    label={t(['common', 'entity', 'linked-url-label', 'one'])}
                    name={label}
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

export function EntityFormFields(): JSX.Element | null {
  const name = 'kind';

  const field = useField(name);
  const kind = field.input.value as EntityKind | undefined;

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
    default:
      return null;
  }
}

function EntityKindSelect(): JSX.Element {
  const name = 'kind';

  const { t } = useI18n<'common'>();
  const field = useField(name);
  const id = useId();

  const label = t(['common', 'entity', 'kind']);
  const placeholder = t(['common', 'entity', 'select-kind']);

  const kinds = entityKinds;

  return (
    <FormField>
      <Label htmlFor={id}>{label}</Label>
      <Select {...field.input} value={field.input.value} onValueChange={field.input.onChange}>
        <SelectTrigger id={id}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {kinds.map((id) => {
            return (
              <SelectItem key={id} value={id}>
                {t(['common', 'entity', 'kinds', id, 'one'])}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </FormField>
  );
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
                className={cn(isFetching && 'opacity-50 grayscale')}
                value={occupation.id}
              >
                {getTranslatedLabel(occupation.label)}
              </ComboBoxItem>
            );
          })}
          {Object.keys(occupations).length === 0 ? (
            <ComboBoxEmpty className={cn(isFetching && 'opacity-50 grayscale')}>
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
  const sourceEntityId = useField('id').input.value;
  const fieldArray = useFieldArray(name);
  const id = useId();

  const dialog = useDialogState();
  const entityDialog = useDialogState();

  const dispatch = useAppDispatch();

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

            return <RelationListItem key={name} name={name} onRemove={onRemove} />;
          })}
        </ul>
      )}

      <hr />

      <div className="grid justify-end gap-2">
        <Button onClick={dialog.open} variant="default">
          <PlusIcon className="mr-1 h-4 w-4 shrink-0" />
          <span>{t(['common', 'form', 'add-relation'])}</span>
        </Button>
        <Button onClick={entityDialog.open} variant="default">
          <PlusIcon className="mr-1 h-4 w-4 shrink-0" />
          <span>{t(['common', 'form', 'create-entity'])}</span>
        </Button>

        <Dialog open={dialog.isOpen} onOpenChange={dialog.toggle}>
          <RelationFormDialog
            onClose={dialog.close}
            onSubmit={(values) => {
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              if (!values.event?.kind || !values.role?.id) return;

              const event = {
                ...values.event,
                id: nanoid(),
                relations: [
                  {
                    entity: sourceEntityId,
                    role: values.role.id,
                  },
                ],
              };

              dispatch(addLocalEvent(event));
              dispatch(addLocalVocabulary({ id: 'role', entries: [values.role] }));
              fieldArray.fields.push({ event: event.id, role: values.role.id });
            }}
          />
        </Dialog>

        <Dialog open={entityDialog.isOpen} onOpenChange={entityDialog.toggle}>
          <CreateEntityDialog
            onClose={entityDialog.close}
            onSubmit={(values) => {
              // @ts-expect-error It's ok.
              const entity = { id: nanoid(), ...values, relations: [] };
              dispatch(addLocalEntity(entity));
            }}
          />
        </Dialog>
      </div>
    </div>
  );
}

interface CreateEntityDialogProps {
  onClose: () => void;
  onSubmit: (values: Entity) => void;
}

function CreateEntityDialog(props: CreateEntityDialogProps): JSX.Element {
  const { onClose } = props;

  const { t } = useI18n<'common'>();

  function onSubmit(values: Entity) {
    onClose();

    props.onSubmit(values);
  }

  const formId = 'create-entity';

  const label = t(['common', 'form', 'create-entity']);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{label}</DialogTitle>
      </DialogHeader>

      <Form
        id={formId}
        onSubmit={onSubmit}
        validate={(values) => {
          const errors: Record<string, string> = {};

          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (values.kind == null || values.kind.trim() === '') {
            errors['kind'] = 'Required';
          }

          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (values.label?.default == null || values.label.default.trim() === '') {
            errors['label.default'] = 'Required';
          }

          return errors;
        }}
      >
        <div className="grid content-start gap-4">
          <EntityKindSelect />
          <hr />
          <EntityLabelTextField />
          <hr />
          <EntityAlternativeLabelFormFields />
          <hr />
          <EntityDescriptionTextField />
          <hr />
          <EntityFormFields />
          <hr />
          <EntityLinkedUriFormFields />
          <hr />
        </div>
      </Form>

      <DialogFooter>
        <Button form={formId} type="submit">
          {t(['common', 'form', 'save'])}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

interface RelationListItemProps {
  name: string;
  onRemove: () => void;
}

function RelationListItem(props: RelationListItemProps): JSX.Element {
  const { name, onRemove } = props;

  const { t } = useI18n<'common'>();

  const field = useField(name);
  const relation = field.input.value as EntityEventRelation;

  const dialog = useDialogState();
  const dispatch = useAppDispatch();

  return (
    <li className="py-6 first-of-type:pt-0 last-of-type:pb-0" key={name}>
      <div className="grid grid-cols-[1fr_auto] items-start gap-2">
        <RelationPreview name={name} />
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
        <RelationFormDialog
          relation={relation}
          onClose={dialog.close}
          onSubmit={(values) => {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (!values.event?.kind || !values.role?.id) return;

            dispatch(addLocalEvent(values.event));
            dispatch(addLocalVocabulary({ id: 'role', entries: [values.role] }));
            field.input.onChange({ event: values.event.id, role: values.role.id });
          }}
        />
      </Dialog>
    </li>
  );
}

function useRelationRole(id: string | undefined) {
  const _role = useAppSelector((state) => {
    if (id == null) return null;
    return selectVocabularyEntryById(state, id);
  });
  const query = useGetRelationRoleByIdQuery({ id: id! }, { skip: _role != null || id == null });

  if (id == null) return { status: 'idle', data: undefined };

  if (_role != null) return { status: 'success', data: _role };

  return { status: query.status, data: query.data };
}

function useEvent(id: string | undefined) {
  const _event = useAppSelector((state) => {
    if (id == null) return null;
    return selectEventById(state, id);
  });
  const query = useGetEventByIdQuery({ id: id! }, { skip: _event != null || id == null });

  if (id == null) return { status: 'idle', data: undefined };

  if (_event != null) return { status: 'success', data: _event };

  return { status: query.status, data: query.data };
}

function useEventKind(id: string | undefined) {
  const _kind = useAppSelector((state) => {
    if (id == null) return null;
    return selectVocabularyEntryById(state, id);
  });
  const query = useGetEventKindByIdQuery({ id: id! }, { skip: _kind != null || id == null });

  if (id == null) return { status: 'idle', data: undefined };

  if (_kind != null) return { status: 'success', data: _kind };

  return { status: query.status, data: query.data };
}

interface RelationFormDialogProps {
  relation?: EntityEventRelation;
  onClose: () => void;
  onSubmit: (values: { event: Event; role: EntityRelationRole }) => void;
}

function RelationFormDialog(props: RelationFormDialogProps): JSX.Element {
  const { relation, onClose } = props;

  const { t } = useI18n<'common'>();
  const dispatch = useAppDispatch();

  function onSubmit(values: { event: Event; role: EntityRelationRole }) {
    onClose();

    // @ts-expect-error It's ok to overwrite id if there is none.
    const event = { id: nanoid(), ...values.event };
    dispatch(addLocalEvent(event));

    // @ts-expect-error It's ok to overwrite id if there is none.
    const role = { id: nanoid(), ...values.role };
    dispatch(addLocalVocabulary({ id: 'role', entries: [role] }));

    props.onSubmit({ event, role });
  }

  const formId = 'relation';

  const label = t(['common', 'entity', 'relation', 'one']);

  const event = useEvent(relation?.event).data;
  const role = useRelationRole(relation?.role).data;
  const initialValues = event == null || role == null ? undefined : { event, role };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{label}</DialogTitle>
      </DialogHeader>

      <RelationForm id={formId} initialValues={initialValues} onSubmit={onSubmit} />

      <DialogFooter>
        <Button form={formId} type="submit">
          {t(['common', 'form', 'save'])}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

interface RelationFormProps {
  id: string;
  initialValues?: { event: Event; role: EntityRelationRole };
  onSubmit: (values: { event: Event; role: EntityRelationRole }) => void;
}

function RelationForm(props: RelationFormProps): JSX.Element {
  const { id, initialValues, onSubmit } = props;

  return (
    <Form
      className="grid gap-2"
      id={id}
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={(values) => {
        const errors: Record<string, string> = {};

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (values.event?.kind == null) {
          errors['event.kind'] = 'Required';
        }
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (values.role?.id == null) {
          errors['role.id'] = 'Required';
        }
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (values.event?.label?.default == null) {
          errors['event.label.default'] = 'Required';
        }

        return errors;
      }}
    >
      <EventKindComboBox name="event.kind" root="event" />
      <RelationRoleComboBox name="role.id" root="role" />
      <FormTextField id={useId()} label="Label" name="event.label.default" />
      <FormTextField id={useId()} label="Start date" name="event.startDate" />
      <FormTextField id={useId()} label="End date" name="event.endDate" />
      {/* <EventRelatedEntities name="event.relations" /> */}
    </Form>
  );
}

interface EventKindComboBoxProps {
  name: string;
  root: string;
}

function EventKindComboBox(props: EventKindComboBoxProps) {
  const { name } = props;

  const field = useField(name);
  // const root = useField(props.root);
  const selectedId = field.input.value as string | undefined;
  const id = useId();

  const dispatch = useAppDispatch();

  const localEventKinds = useAppSelector((state) => {
    return selectLocalVocabularyById(state, 'event-kind');
  });
  const localSelected =
    selectedId != null && selectedId !== '' ? localEventKinds?.[selectedId] : undefined;

  const _selected = useGetEventKindByIdQuery(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    { id: selectedId! },
    { skip: selectedId == null || selectedId === '' || localSelected != null },
  ).data;
  const selected = localSelected ?? _selected;

  const [searchTerm, setSearchTerm] = useState('');
  const q = useDebouncedValue(searchTerm.trim());

  const localMatches = useMemo(() => {
    if (localEventKinds == null) return [];
    const _searchTerm = searchTerm.toLowerCase().trim();
    if (_searchTerm.length === 0) return Object.values(localEventKinds).slice(0, 25);
    return Object.values(localEventKinds)
      .filter((entry) => {
        return entry.label.default.toLowerCase().includes(_searchTerm);
      })
      .slice(0, 25);
  }, [localEventKinds, searchTerm]);

  const { data, isLoading, isFetching } = useSearchEventKindsQuery({ q });
  const kinds = useMemo(() => {
    const kinds = keyBy((data?.results ?? []).concat(localMatches), (kind) => {
      return kind.id;
    });
    if (selected != null) {
      kinds[selected.id] = selected;
    }
    return kinds;
  }, [data, selected, localMatches]);

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.currentTarget.value);
  }

  function getDisplayLabel(id: string) {
    const kind = kinds[id];
    if (kind == null) return '';
    return getTranslatedLabel(kind.label);
  }

  function onCreate() {
    const id = nanoid();
    const entry = { id, label: { default: searchTerm } };
    dispatch(addLocalVocabulary({ id: 'event-kind', entries: [entry] }));
    field.input.onChange(id);
  }

  function onValueChange(id: string) {
    field.input.onChange(id);
  }

  return (
    <FormField>
      <Label htmlFor={id}>Event kind</Label>
      <ComboBox disabled={isLoading} onValueChange={onValueChange} value={field.input.value}>
        <ComboBoxTrigger>
          <ComboBoxInput
            displayValue={getDisplayLabel}
            id={id}
            onChange={onInputChange}
            placeholder="Select event kind"
          />
          {isFetching ? <LoadingIndicator className="mr-4 text-neutral-500" size="sm" /> : null}
          <ComboBoxButton />
        </ComboBoxTrigger>
        <ComboBoxContent>
          {Object.values(kinds).map((kind) => {
            return (
              <ComboBoxItem
                key={kind.id}
                value={kind.id}
                className={cn(isFetching && 'opacity-50 grayscale')}
              >
                {getTranslatedLabel(kind.label)}
              </ComboBoxItem>
            );
          })}
          {Object.keys(kinds).length === 0 ? (
            <ComboBoxEmpty className={cn(isFetching && 'opacity-50 grayscale')}>
              Nothing found
            </ComboBoxEmpty>
          ) : null}
          <div>
            <button
              className="flex w-full border-t p-2 text-sm hover:bg-neutral-100"
              onClick={onCreate}
              type="button"
            >
              Create new entry for &quot;{searchTerm}&quot;
            </button>
          </div>
        </ComboBoxContent>
      </ComboBox>
    </FormField>
  );
}

interface RelationRoleComboBoxProps {
  name: string;
  root: string;
}

function RelationRoleComboBox(props: RelationRoleComboBoxProps) {
  const { name } = props;

  const field = useField(name);
  const root = useField(props.root);
  const selectedId = field.input.value as string | undefined;
  const id = useId();

  const dispatch = useAppDispatch();

  const localRoles = useAppSelector((state) => {
    return selectLocalVocabularyById(state, 'role');
  });
  const localSelected =
    selectedId != null && selectedId !== '' ? localRoles?.[selectedId] : undefined;

  const _selected = useGetRelationRoleByIdQuery(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    { id: selectedId! },
    { skip: selectedId == null || selectedId === '' || localSelected != null },
  ).data;
  const selected = localSelected ?? _selected;

  const [searchTerm, setSearchTerm] = useState('');
  const q = useDebouncedValue(searchTerm.trim());

  const localMatches = useMemo(() => {
    if (localRoles == null) return [];
    const _searchTerm = searchTerm.toLowerCase().trim();
    if (_searchTerm.length === 0) return Object.values(localRoles).slice(0, 25);
    return Object.values(localRoles)
      .filter((entry) => {
        return entry.label.default.toLowerCase().includes(_searchTerm);
      })
      .slice(0, 25);
  }, [localRoles, searchTerm]);

  const { data, isLoading, isFetching } = useSearchRelationRolesQuery({ q });
  const roles = useMemo(() => {
    const roles = keyBy((data?.results ?? []).concat(localMatches), (role) => {
      return role.id;
    });
    if (selected != null) {
      roles[selected.id] = selected;
    }
    return roles;
  }, [data, selected, localMatches]);

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.currentTarget.value);
  }

  function getDisplayLabel(id: string) {
    const role = roles[id];
    if (role == null) return '';
    return getTranslatedLabel(role.label);
  }

  function onCreate() {
    const id = nanoid();
    const entry = { id, label: { default: searchTerm } };
    dispatch(addLocalVocabulary({ id: 'role', entries: [entry] }));
    root.input.onChange(entry);
  }

  function onValueChange(id: string) {
    root.input.onChange(roles[id]);
  }

  return (
    <FormField>
      <Label htmlFor={id}>Role</Label>
      <ComboBox disabled={isLoading} onValueChange={onValueChange} value={field.input.value}>
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
          {Object.keys(roles).length === 0 ? (
            <ComboBoxEmpty className={cn(isFetching && 'opacity-50 grayscale')}>
              Nothing found
            </ComboBoxEmpty>
          ) : null}
          <div>
            <button
              className="flex w-full border-t p-2 text-sm hover:bg-neutral-100"
              onClick={onCreate}
              type="button"
            >
              Create new entry for &quot;{searchTerm}&quot;
            </button>
          </div>
        </ComboBoxContent>
      </ComboBox>
    </FormField>
  );
}

interface RelatedEventComboBoxProps {
  name: string;
}

function _RelatedEventComboBox(props: RelatedEventComboBoxProps) {
  const { name } = props;

  const field = useField(name);
  const selectedId = field.input.value as string | undefined;
  const id = useId();

  const selected = useEntityEvent(selectedId).data;

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

interface RelatedEntityComboBoxProps {
  name: string;
  root: string;
}

function RelatedEntityComboBox(props: RelatedEntityComboBoxProps) {
  const { name } = props;

  const field = useField(name);
  const root = useField(props.root);
  const selectedId = field.input.value as string | undefined;
  const id = useId();

  const localEntities = useAppSelector(selectLocalEntities);

  const selected = useEntity(selectedId).data;

  const [searchTerm, setSearchTerm] = useState('');
  const q = useDebouncedValue(searchTerm.trim());

  const localMatches = useMemo(() => {
    const _searchTerm = searchTerm.toLowerCase().trim();
    if (_searchTerm.length === 0) return Object.values(localEntities).slice(0, 25);
    return Object.values(localEntities)
      .filter((entry) => {
        return entry.label.default.toLowerCase().includes(_searchTerm);
      })
      .slice(0, 25);
  }, [localEntities, searchTerm]);

  const { data, isLoading, isFetching } = useSearchEntitiesQuery({ q });
  const entities = useMemo(() => {
    const entities = keyBy((data?.results ?? []).concat(localMatches), (event) => {
      return event.id;
    });
    if (selected != null) {
      entities[selected.id] = selected;
    }
    return entities;
  }, [data, selected, localMatches]);

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.currentTarget.value);
  }

  function getDisplayLabel(id: string) {
    const entity = entities[id];
    if (entity == null) return '';
    return getTranslatedLabel(entity.label);
  }

  function onValueChange(id: string) {
    root.input.onChange(entities[id]);
  }

  return (
    <FormField>
      <Label htmlFor={id}>Entity</Label>
      <ComboBox disabled={isLoading} onValueChange={onValueChange} value={field.input.value}>
        <ComboBoxTrigger>
          <ComboBoxInput
            displayValue={getDisplayLabel}
            id={id}
            onChange={onInputChange}
            placeholder="Select entity"
          />
          {isFetching ? <LoadingIndicator className="mr-4 text-neutral-500" size="sm" /> : null}
          <ComboBoxButton />
        </ComboBoxTrigger>
        <ComboBoxContent>
          {Object.values(entities).map((entity) => {
            return (
              <ComboBoxItem
                key={entity.id}
                value={entity.id}
                className={cn(isFetching && 'opacity-50 grayscale')}
              >
                {getTranslatedLabel(entity.label)}
              </ComboBoxItem>
            );
          })}
          {Object.keys(entities).length === 0 ? (
            <ComboBoxEmpty className={cn(isFetching && 'opacity-50 grayscale')}>
              Nothing found
            </ComboBoxEmpty>
          ) : null}
        </ComboBoxContent>
      </ComboBox>
    </FormField>
  );
}

interface RelationPreview {
  name: string;
}

function RelationPreview(props: RelationPreview): JSX.Element {
  const { name } = props;

  const dialog = useDialogState();
  const dispatch = useAppDispatch();

  const sourceEntityId = useField('id').input.value;

  const field = useField(name);
  const relation = field.input.value as EntityEventRelation;

  const eventQuery = useEvent(relation.event);
  const roleQuery = useRelationRole(relation.role);

  const event = eventQuery.data;
  const role = roleQuery.data;

  const kindQuery = useEventKind(event?.kind);
  const kind = kindQuery.data;

  const relatedEntitesQuery = useEntities(
    event?.relations.map((r) => {
      return r.entity;
    }) ?? [],
  );
  const relatedEntites = relatedEntitesQuery.data;

  const relationRolesQuery = useRelationRoles(
    event?.relations.map((r) => {
      return r.role;
    }) ?? [],
  );
  const relationRoles = relationRolesQuery.data;

  const _entites = useAppSelector(selectEntities);

  if (
    eventQuery.status === 'fetching' ||
    roleQuery.status === 'fetching' ||
    kindQuery.status === 'fetching' ||
    // relationRolesQuery.status === 'pending' || // FIXME: unfortunately backend does not resolve all ids
    relatedEntitesQuery.status === 'pending'
  ) {
    return (
      <div>
        <LoadingIndicator />
      </div>
    );
  }

  if (
    event == null ||
    role == null ||
    kind == null ||
    // relationRoles == null ||
    relatedEntites == null
  ) {
    return (
      <div>
        <NothingFoundMessage />
      </div>
    );
  }

  const relations = event.relations.filter((r) => {
    return r.entity !== sourceEntityId;
  });

  return (
    <article className="grid gap-2">
      <div className="text-sm">
        <EventDate start={event.startDate} end={event.endDate} />
      </div>
      <span className="text-neutral-500">
        {getTranslatedLabel(kind.label)} | {getTranslatedLabel(role.label)}
      </span>
      <span>{getTranslatedLabel(event.label)}</span>

      {relations.length > 0 ? (
        <Collapsible>
          <CollapsibleTrigger className="group flex items-center gap-1">
            <ChevronRightIcon className="h-4 w-4 shrink-0 transition group-data-[state=open]:rotate-90" />
            <span>Related entities ({relations.length})</span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul role="list" className="grid gap-2 py-1">
              {relations.map((r) => {
                const entity = relatedEntites.get(r.entity);
                const role = relationRoles?.get(r.role);

                if (entity == null || role == null) return null;

                return (
                  <li key={[r.role, r.entity].join('+')}>
                    <span>{getTranslatedLabel(entity.label)}</span>
                    <span> ({getTranslatedLabel(role.label)})</span>
                  </li>
                );
              })}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      ) : null}

      <Button onClick={dialog.open} size="sm" variant="outline">
        <PlusIcon className="h-4 w-4" />
        <span>Add related entity</span>
      </Button>

      <Dialog open={dialog.isOpen} onOpenChange={dialog.toggle}>
        <AddEntityToRelationFormDialog
          onClose={dialog.close}
          onSubmit={(values: { entity: Entity; role: EntityRelationRole }) => {
            const targetEntity = values.entity;

            dispatch(
              addLocalEvent({
                ...event,
                relations: [
                  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                  ...(event.relations ?? []),
                  {
                    entity: values.entity.id,
                    role: values.role.id,
                  },
                ],
              }),
            );

            dispatch(
              addLocalEntity({
                ...targetEntity,
                relations: [
                  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                  ...(targetEntity.relations ?? []),
                  { role: values.role.id, event: event.id },
                ],
              }),
            );
          }}
        />
      </Dialog>
    </article>
  );
}

function AddEntityToRelationFormDialog({
  onClose,
  onSubmit: _onSubmit,
}: {
  onClose: () => void;
  onSubmit: (values: { entity: Entity; role: EntityRelationRole }) => void;
}): JSX.Element {
  const { t } = useI18n<'common'>();

  const formId = 'add-related-entity';

  function onSubmit(values: { entity: Entity; role: EntityRelationRole }) {
    onClose();

    _onSubmit(values);
  }

  const initialValues = undefined; // TODO:

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add related entity</DialogTitle>
      </DialogHeader>

      <Form
        className="grid gap-2"
        id={formId}
        initialValues={initialValues}
        onSubmit={onSubmit}
        validate={(values) => {
          const errors: Record<string, string> = {};

          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (values.role?.id == null || values.role.id.trim() === '') {
            errors['role.id'] = 'Required';
          }

          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (values.entity?.id == null || values.entity.id.trim() === '') {
            errors['entity.id'] = 'Required';
          }

          return errors;
        }}
      >
        <RelationRoleComboBox name="role.id" root="role" />
        <RelatedEntityComboBox name="entity.id" root="entity" />
      </Form>

      <DialogFooter>
        <Button form={formId} type="submit">
          {t(['common', 'form', 'save'])}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

interface EventDateProps {
  start: string | undefined;
  end: string | undefined;
}

function formatDateTime(date: string) {
  return Intl.DateTimeFormat('en-GB', { dateStyle: 'short' }).format(new Date(date));
}

function EventDate(props: EventDateProps) {
  const { start, end } = props;

  const dates = [start, end].filter(isNonEmptyString).map(formatDateTime);

  if (dates.length === 0) return <NoDateQualityIndicator />;

  if (dates.length === 1) {
    const [date] = dates;
    return <time dateTime={date}>{date}</time>;
  }

  const [startDate, endDate] = dates;
  return (
    <span>
      <time dateTime={startDate}>{startDate}</time>
      <span> &ndash; </span>
      <time dateTime={endDate}>{endDate}</time>
    </span>
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
          <iframe
            className="h-56 w-full object-contain"
            src={media.url}
            title={label}
            frameBorder={0}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer"
          />
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
      {media.kind === 'link' ? (
        <div>
          <a href={media.url} target="_blank" rel="noreferrer">
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

  const formId = 'media';

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

  const kinds = ['image', 'document', 'video', 'embed', 'link'] as const;

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

export function BiographiesFormFields(): JSX.Element {
  const name = 'biographies';

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

            return <BiographyListItem key={name} name={name} onRemove={onRemove} />;
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
          <BiographyFormDialog
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

interface BiographyFormProps {
  id: string;
  initialValues?: Biography;
  onSubmit: (values: Biography) => void;
}

function BiographyForm(props: BiographyFormProps): JSX.Element {
  const { id, initialValues, onSubmit } = props;

  return (
    <Form className="grid gap-2" id={id} initialValues={initialValues} onSubmit={onSubmit}>
      <FormTextField id={useId()} label="Title" name="title" />
      <FormTextField id={useId()} label="Abstract" name="abstract" />
      <FormTextAreaField id={useId()} label="Text" name="text" required />
      <FormTextField id={useId()} label="Citation" name="citation" />
    </Form>
  );
}

interface BiographyFormDialogProps {
  id?: string;
  onClose: () => void;
  onSubmit: (values: Biography) => void;
}

function BiographyFormDialog(props: BiographyFormDialogProps): JSX.Element {
  const { id, onClose } = props;

  const { t } = useI18n<'common'>();
  const dispatch = useAppDispatch();

  function onSubmit(values: Biography) {
    onClose();

    // @ts-expect-error It's ok to overwrite id if there is none.
    const biography = { id: nanoid(), ...values };

    dispatch(addLocalBiography(biography));

    props.onSubmit(biography);
  }

  const formId = 'biography';

  const label = t(['common', 'entity', 'biography', 'one']);

  const initialValues = useBiography(id).data;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{label}</DialogTitle>
      </DialogHeader>

      <BiographyForm id={formId} initialValues={initialValues} onSubmit={onSubmit} />

      <DialogFooter>
        <Button form={formId} type="submit">
          {t(['common', 'form', 'save'])}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

interface BiographyListItemProps {
  name: string;
  onRemove: () => void;
}

function BiographyListItem(props: BiographyListItemProps): JSX.Element {
  const { name, onRemove } = props;

  const { t } = useI18n<'common'>();

  const field = useField(name);
  const id = field.input.value;

  const dialog = useDialogState();

  return (
    <li className="py-6 first-of-type:pt-0 last-of-type:pb-0" key={name}>
      <div className="grid grid-cols-[1fr_auto] items-end gap-2">
        <BiographyPreview name={name} />
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
        <BiographyFormDialog
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

function useBiography(id: string | undefined) {
  const _bio = useAppSelector((state) => {
    if (id == null) return null;
    return selectBiographyById(state, id);
  });
  const query = useGetBiographyByIdQuery({ id: id! }, { skip: _bio != null || id == null });

  if (id == null) return { status: 'idle', data: undefined };

  if (_bio != null) return { status: 'success', data: _bio };

  return { status: query.status, data: query.data };
}

interface BiographyPreview {
  name: string;
}

function BiographyPreview(props: BiographyPreview): JSX.Element {
  const { name } = props;

  const field = useField(name);
  const id = field.input.value;

  const query = useBiography(id);
  const bio = query.data;

  if (query.status === 'fetching') {
    return (
      <div>
        <LoadingIndicator />
      </div>
    );
  }

  if (bio == null) {
    return (
      <div>
        <NothingFoundMessage />
      </div>
    );
  }

  return (
    <article className="grid gap-2">
      <div>{bio.title}</div>
      <div>{bio.abstract}</div>
      <div>{bio.text}</div>
      <div>{bio.citation}</div>
    </article>
  );
}
