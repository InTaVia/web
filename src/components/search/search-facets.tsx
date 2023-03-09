import { XIcon } from '@heroicons/react/solid';
import type { EntityKind, InternationalizedLabel, SearchEntities } from '@intavia/api-client';
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
  Label,
  LoadingIndicator,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@intavia/ui';
import { keyBy } from '@stefanprobst/key-by';
import type { ChangeEvent } from 'react';
import { useId, useMemo, useState } from 'react';
import { useField } from 'react-final-form';

import {
  useGetEntityByIdQuery,
  useGetRelationRoleByIdQuery,
  useSearchEntitiesQuery,
  useSearchRelationRolesQuery,
} from '@/api/intavia.service';
import { useI18n } from '@/app/i18n/use-i18n';
import { useAppSelector } from '@/app/store';
import { selectEntities, selectVocabularyEntries } from '@/app/store/intavia.slice';
import { Form } from '@/components/form';
import { FormField } from '@/components/form-field';
import { useSearchEntities } from '@/components/search/use-search-entities';
import { useSearchEntitiesFilters } from '@/components/search/use-search-entities-filters';
import { getTranslatedLabel } from '@/lib/get-translated-label';
import { isNonEmptyString } from '@/lib/is-nonempty-string';
import { useDebouncedValue } from '@/lib/use-debounced-value';

export function SearchFacets(): JSX.Element {
  const searchFilters = useSearchEntitiesFilters();
  const { search } = useSearchEntities();

  function onSubmit(values: SearchEntities.SearchParams) {
    search({
      ...searchFilters,
      ...values,
      page: 1,
    });
  }

  const formId = 'search-facets';

  return (
    <div>
      <Form id={formId} initialValues={searchFilters} onSubmit={onSubmit}>
        <div className="grid gap-4">
          <EntityKindFilter />
          <RelationRoleFilter />
          <RelatedEntityFilter />

          <div className="flex justify-end">
            <Button type="submit">Apply</Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

function RelatedEntityFilter(): JSX.Element {
  const name = 'related_entities_id.0';

  // const { t } = useI18n<'common'>();
  const field = useField(name);
  const id = useId();

  const label = 'Related entity';
  const placeholder = 'Select entity';

  const hasSelection = isNonEmptyString(field.input.value);
  const storedEntities = useAppSelector(selectEntities);
  const selectedEntityFromStore = hasSelection ? storedEntities[field.input.value] : undefined;
  const { data: selectedEntityFromBackend, isLoading: isInitialLoading } = useGetEntityByIdQuery(
    { id: field.input.value },
    { skip: !hasSelection || selectedEntityFromStore != null },
  );
  const selected = selectedEntityFromStore ?? selectedEntityFromBackend;

  const [searchTerm, setSearchTerm] = useState('');
  const q = useDebouncedValue(searchTerm.trim());
  const { data, isLoading, isFetching } = useSearchEntitiesQuery({ q });
  const events = useMemo(() => {
    const events = keyBy(data?.results ?? [], (e) => {
      return e.id;
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
    const event = events[id] ?? storedEntities[id];
    if (event == null) return '';
    return getTranslatedLabel(event.label);
  }

  function onClear() {
    field.input.onChange(undefined);
  }

  return (
    <FormField>
      <Label htmlFor={id}>{label}</Label>
      <ComboBox
        disabled={isLoading || isInitialLoading}
        onValueChange={field.input.onChange}
        value={field.input.value}
      >
        <ComboBoxTrigger>
          <ComboBoxInput
            displayValue={getDisplayLabel}
            id={id}
            onChange={onInputChange}
            placeholder={placeholder}
          />
          {isFetching || isInitialLoading ? (
            <LoadingIndicator className="mr-4 text-neutral-500" size="sm" />
          ) : null}
          {isNonEmptyString(field.input.value) && !isFetching && !isInitialLoading ? (
            <ClearButton className="mr-4 text-neutral-500" onClick={onClear} />
          ) : null}
          <ComboBoxButton />
        </ComboBoxTrigger>
        <ComboBoxContent>
          {Object.values(events).map((event) => {
            return (
              <ComboBoxItem
                key={event.id}
                className={cn(isFetching && 'opacity-50 neutralscale')}
                value={event.id}
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

function RelationRoleFilter(): JSX.Element {
  const name = 'event_roles_id.0';

  // const { t } = useI18n<'common'>();
  const field = useField(name);
  const id = useId();

  const label = 'Relation role';
  const placeholder = 'Select role';

  const hasSelection = isNonEmptyString(field.input.value);
  const storedRoles = useAppSelector(selectVocabularyEntries);
  const selectedRoleFromStore = hasSelection ? storedRoles[field.input.value] : undefined;
  const { data: selectedRoleFrombackend, isLoading: isInitialLoading } =
    useGetRelationRoleByIdQuery(
      { id: field.input.value },
      { skip: !hasSelection || selectedRoleFromStore != null },
    );
  const selected = selectedRoleFromStore ?? selectedRoleFrombackend;

  const [searchTerm, setSearchTerm] = useState('');
  const q = useDebouncedValue(searchTerm.trim());
  const { data, isLoading, isFetching } = useSearchRelationRolesQuery({ q });
  const roles = useMemo(() => {
    const roles = keyBy(data?.results ?? [], (e) => {
      return e.id;
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
    const role = roles[id] ?? storedRoles[id];
    if (role == null) return '';
    return getTranslatedLabel(role.label);
  }

  function onClear() {
    field.input.onChange(undefined);
  }

  return (
    <FormField>
      <Label htmlFor={id}>{label}</Label>
      <ComboBox
        disabled={isLoading || isInitialLoading}
        onValueChange={field.input.onChange}
        value={field.input.value}
      >
        <ComboBoxTrigger>
          <ComboBoxInput
            displayValue={getDisplayLabel}
            id={id}
            onChange={onInputChange}
            placeholder={placeholder}
          />
          {isFetching || isInitialLoading ? (
            <LoadingIndicator className="mr-4 text-neutral-500" size="sm" />
          ) : null}
          {isNonEmptyString(field.input.value) && !isFetching && !isInitialLoading ? (
            <ClearButton className="mr-4 text-neutral-500" onClick={onClear} />
          ) : null}
          <ComboBoxButton />
        </ComboBoxTrigger>
        <ComboBoxContent>
          {Object.values(roles).map((role) => {
            return (
              <ComboBoxItem
                key={role.id}
                className={cn(isFetching && 'opacity-50 neutralscale')}
                value={role.id}
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

function EntityKindFilter(): JSX.Element {
  const name = 'kind.0';

  const { t } = useI18n<'common'>();
  const field = useField(name);
  const id = useId();

  const label = t(['common', 'entity', 'kind']);
  const placeholder = 'Select entity kind';

  const kinds: Record<EntityKind, InternationalizedLabel> = {
    'cultural-heritage-object': {
      default: t(['common', 'entity', 'kinds', 'cultural-heritage-object', 'other']),
    },
    group: { default: t(['common', 'entity', 'kinds', 'group', 'other']) },
    person: { default: t(['common', 'entity', 'kinds', 'person', 'other']) },
    place: { default: t(['common', 'entity', 'kinds', 'place', 'other']) },
    'historical-event': {
      default: t(['common', 'entity', 'kinds', 'historical-event', 'other']),
    },
  };

  return (
    <FormField>
      <Label htmlFor={id}>{label}</Label>
      <Select {...field.input} onValueChange={field.input.onChange}>
        <SelectTrigger id={id}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem key="__all__" value="">
            Any
          </SelectItem>
          {Object.entries(kinds).map(([id, label]) => {
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

interface ClearButtonProps {
  className?: string;
  onClick: () => void;
}

function ClearButton(props: ClearButtonProps): JSX.Element {
  const { className, onClick } = props;

  return (
    <button className={className} onClick={onClick}>
      <span className="sr-only">Clear</span>
      <XIcon className="h-4 w-4" />
    </button>
  );
}
