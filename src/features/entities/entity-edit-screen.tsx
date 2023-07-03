import type { Entity } from '@intavia/api-client';
import { Button } from '@intavia/ui';

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

  return (
    <main>
      <EntityEditForm entity={entityQuery.data} />
    </main>
  );
}

interface EntityEditFormProps {
  entity: Entity;
}

function EntityEditForm(props: EntityEditFormProps): JSX.Element {
  const { entity } = props;

  const { t, formatDateTime } = useI18n<'common'>();
  formatDateTime(new Date(), { dateStyle: 'full' });

  const dispatch = useAppDispatch();

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
  }

  const label = t(['common', 'entity', 'edit-entity'], {
    values: { kind: t(['common', 'entity', 'kinds', entity.kind, 'one']) },
  });

  const formId = 'edit-entity';

  return (
    <Form id={formId} initialValues={entity} onSubmit={onSubmit}>
      <EntityLabelTextField />
      <EntityDescriptionTextField />
      <EntityFormFields kind={entity.kind} />
      <hr />
      <RelationsFormFields />

      <Button type="submit">{t(['common', 'form', 'save'])}</Button>
    </Form>
  );
}
