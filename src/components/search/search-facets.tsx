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

import { useSearchEntitiesQuery, useSearchRelationRolesQuery } from '@/api/intavia.service';
import { useI18n } from '@/app/i18n/use-i18n';
import { useAppSelector } from '@/app/store';
import { selectEvents, selectVocabularyEntries } from '@/app/store/intavia.slice';
import { Form } from '@/components/form';
import { FormField } from '@/components/form-field';
import { useSearchEntities } from '@/components/search/use-search-entities';
import { useSearchEntitiesFilters } from '@/components/search/use-search-entities-filters';
import { getTranslatedLabel } from '@/lib/get-translated-label';
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
  const name = 'relatedEntities_id.0';

  // const { t } = useI18n<'common'>();
  const field = useField(name);
  const id = useId();

  const label = 'Related entity';
  const placeholder = 'Select entity';

  const [searchTerm, setSearchTerm] = useState('');
  const q = useDebouncedValue(searchTerm.trim());
  const { data, isLoading, isFetching } = useSearchEntitiesQuery({ q });
  const events = useMemo(() => {
    return keyBy(data?.results ?? [], (e) => {
      return e.id;
    });
  }, [data]);

  const _stored = useAppSelector(selectEvents);

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.currentTarget.value);
  }

  function getDisplayLabel(id: string) {
    const event = events[id] ?? _stored[id];
    if (event == null) return '';
    return getTranslatedLabel(event.label);
  }

  return (
    <FormField>
      <Label htmlFor={id}>{label}</Label>
      <ComboBox disabled={isLoading} onValueChange={field.input.onChange} value={field.input.value}>
        <ComboBoxTrigger>
          <ComboBoxInput
            displayValue={getDisplayLabel}
            id={id}
            onChange={onInputChange}
            placeholder={placeholder}
          />
          <ComboBoxButton />
          {isFetching ? <LoadingIndicator className="mr-4 text-neutral-500" size="sm" /> : null}
        </ComboBoxTrigger>
        <ComboBoxContent>
          {Object.values(events).map((event) => {
            return (
              <ComboBoxItem
                key={event.id}
                className={cn(isFetching && 'opacity-50 grayscale')}
                value={event.id}
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

function RelationRoleFilter(): JSX.Element {
  const name = 'eventRoles_id.0';

  // const { t } = useI18n<'common'>();
  const field = useField(name);
  const id = useId();

  const label = 'Relation role';
  const placeholder = 'Select role';

  const [searchTerm, setSearchTerm] = useState('');
  const q = useDebouncedValue(searchTerm.trim());
  const { data, isLoading, isFetching } = useSearchRelationRolesQuery({ q });
  const roles = useMemo(() => {
    return keyBy(data?.results ?? [], (e) => {
      return e.id;
    });
  }, [data]);

  const _stored = useAppSelector(selectVocabularyEntries);

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.currentTarget.value);
  }

  function getDisplayLabel(id: string) {
    const role = roles[id] ?? _stored[id];
    if (role == null) return '';
    return getTranslatedLabel(role.label);
  }

  return (
    <FormField>
      <Label htmlFor={id}>{label}</Label>
      <ComboBox disabled={isLoading} onValueChange={field.input.onChange} value={field.input.value}>
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
          {Object.values(roles).map((role) => {
            return (
              <ComboBoxItem
                key={role.id}
                className={cn(isFetching && 'opacity-50 grayscale')}
                value={role.id}
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
