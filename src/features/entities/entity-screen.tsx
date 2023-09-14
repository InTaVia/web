import type { Entity } from '@intavia/api-client';

import { EntityDetails } from '@/features/entities/entity-details';
import { useEntity } from '@/lib/use-entity';

interface EntityScreenProps {
  id: Entity['id'];
}

export function EntityScreen(props: EntityScreenProps): JSX.Element {
  const { id } = props;

  const entityQuery = useEntity(id);

  if (entityQuery.status === 'error') {
    return <p>Error</p>;
  }

  if (entityQuery.status !== 'success') {
    return <p>Loading...</p>;
  }

  return <EntityDetails entity={entityQuery.data} />;
}
