import type { Entity } from '@intavia/api-client';
import { Button, Tabs, TabsContent, TabsList, TabsTrigger, useToast } from '@intavia/ui';
import { compareAsc } from 'date-fns';
import { useRouter } from 'next/router';

import { useI18n } from '@/app/i18n/use-i18n';
import { useAppDispatch } from '@/app/store';
import { addLocalEntity } from '@/app/store/intavia.slice';
import { Form } from '@/components/form';
import { IntaviaIcon } from '@/features/common/icons/intavia-icon';
import {
  BiographiesFormFields,
  EntityAlternativeLabelFormFields,
  EntityDescriptionTextField,
  EntityFormFields,
  EntityLabelTextField,
  EntityLinkedUriFormFields,
  MediaFormFields,
  RelationsFormFields,
} from '@/features/entities/entity-edit-form-fields';
import { isNonEmptyString } from '@/lib/is-nonempty-string';
import { unique } from '@/lib/unique';
import { useEntity } from '@/lib/use-entity';
import { useEventKinds } from '@/lib/use-event-kinds';
import { useEvents } from '@/lib/use-events';
import { useRelationRoles } from '@/lib/use-relation-roles';

interface EntityEditScreenProps {
  id: Entity['id'];
}

export function EntityEditScreen(props: EntityEditScreenProps): JSX.Element {
  const { id } = props;

  const entityQuery = useEntity(id);

  if (entityQuery.status === 'error') {
    return <p>Error</p>;
  }

  if (entityQuery.status !== 'success') {
    return <p>Loading...</p>;
  }

  return <EntityEditForm entity={entityQuery.data} />;
}

interface EntityEditFormProps {
  entity: Entity;
}

function EntityEditForm(props: EntityEditFormProps): JSX.Element {
  const { entity } = props;

  const { t, formatDateTime } = useI18n<'common'>();
  formatDateTime(new Date(), { dateStyle: 'full' });

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { toast } = useToast();

  function onSubmit(values: Entity) {
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

    toast({
      title: 'Success',
      description: 'Successfully updated entity',
    });

    void router.push(`/entities/${sanitized.id}`);
  }

  const label = t(['common', 'entity', 'edit-entity'], {
    values: { kind: t(['common', 'entity', 'kinds', entity.kind, 'one']) },
  });

  const formId = 'edit-entity';

  // bulk prefetch
  const _roles = useRelationRoles(
    entity.relations.map((relation) => {
      return relation.role;
    }),
  );
  const events = useEvents(
    entity.relations.map((relation) => {
      return relation.event;
    }),
  );
  const _eventKinds = useEventKinds(
    unique(
      Array.from(events.data!.values(), (event) => {
        return event.kind;
      }),
    ),
  );

  const entityWithSortedRelations = {
    ...entity,
    relations: [...entity.relations].sort((_a, _z) => {
      const a = events.data?.get(_a.event)?.startDate ?? events.data?.get(_a.event)?.endDate;
      const z = events.data?.get(_z.event)?.startDate ?? events.data?.get(_z.event)?.endDate;
      if (a == null || a === '') return -1;
      if (z == null || z === '') return 1;
      return compareAsc(new Date(a), new Date(z));
    }),
  };

  return (
    <Form
      className="grid h-full sm:grid-cols-[384px_1px_1fr]"
      id={formId}
      initialValues={entityWithSortedRelations}
      onSubmit={onSubmit}
    >
      <div className="grid grid-rows-[auto_1fr_auto] gap-4 p-4">
        <h2 className="flex items-center gap-2 font-bold">
          <IntaviaIcon className="h-5 w-5 fill-none stroke-2" icon={entity.kind} />
          {label}
        </h2>
        <div className="grid content-start gap-4">
          <EntityLabelTextField />
          <hr />
          <EntityAlternativeLabelFormFields />
          <hr />
          <EntityDescriptionTextField />
          <hr />
          <EntityFormFields kind={entity.kind} />
          <hr />
          <EntityLinkedUriFormFields />
          <hr />
        </div>
        <div className="justify-self-end">
          <Button type="submit">{t(['common', 'form', 'save-entity'])}</Button>
        </div>
      </div>

      <div className="bg-neutral-200" role="separator" />

      <div className="grid content-start gap-4 p-4">
        <Tabs defaultValue="relations">
          <TabsList>
            <TabsTrigger value="relations">
              {t(['common', 'entity', 'relation', 'other'])}
            </TabsTrigger>
            <TabsTrigger value="media">{t(['common', 'entity', 'media', 'other'])}</TabsTrigger>
            {entity.kind === 'person' ? (
              <TabsTrigger value="biographies">
                {t(['common', 'entity', 'biography', 'other'])}
              </TabsTrigger>
            ) : null}
          </TabsList>

          <TabsContent value="relations">
            <RelationsFormFields />
          </TabsContent>

          <TabsContent value="media">
            <MediaFormFields />
          </TabsContent>

          {entity.kind === 'person' ? (
            <TabsContent value="biographies">
              <BiographiesFormFields />
            </TabsContent>
          ) : null}
        </Tabs>

        <hr />

        <div className="justify-self-end">
          <Button type="submit">{t(['common', 'form', 'save-entity'])}</Button>
        </div>
      </div>
    </Form>
  );
}
