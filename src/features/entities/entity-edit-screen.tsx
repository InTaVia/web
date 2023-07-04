import type { Entity } from '@intavia/api-client';
import { Button, Tabs, TabsContent, TabsList, TabsTrigger, useToast } from '@intavia/ui';

import { useI18n } from '@/app/i18n/use-i18n';
import { useAppDispatch } from '@/app/store';
import { addLocalEntity } from '@/app/store/intavia.slice';
import { Form } from '@/components/form';
import {
  EntityDescriptionTextField,
  EntityFormFields,
  EntityLabelTextField,
  RelationsFormFields,
} from '@/features/entities/entity-edit-form-fields';
import { isNonEmptyString } from '@/lib/is-nonempty-string';
import { useEntity } from '@/lib/use-entity';

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
  }

  const label = t(['common', 'entity', 'edit-entity'], {
    values: { kind: t(['common', 'entity', 'kinds', entity.kind, 'one']) },
  });

  const formId = 'edit-entity';

  return (
    <Form
      className="grid min-h-full sm:grid-cols-[384px_1px_1fr]"
      id={formId}
      initialValues={entity}
      onSubmit={onSubmit}
    >
      <div className="grid content-start gap-4 p-4">
        <h2>{label}</h2>
        <EntityLabelTextField />
        <EntityDescriptionTextField />
        <EntityFormFields kind={entity.kind} />

        <hr />

        <div className="justify-self-end">
          <Button type="submit">{t(['common', 'form', 'save'])}</Button>
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
            <TabsTrigger value="biographies">
              {t(['common', 'entity', 'biography', 'other'])}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="relations">
            <RelationsFormFields />
          </TabsContent>

          <TabsContent value="media">
            <div>Media</div>
          </TabsContent>

          <TabsContent value="biographies">
            <div>Biographies</div>
          </TabsContent>
        </Tabs>

        <hr />

        <div className="justify-self-end">
          <Button type="submit">{t(['common', 'form', 'save'])}</Button>
        </div>
      </div>
    </Form>
  );
}
