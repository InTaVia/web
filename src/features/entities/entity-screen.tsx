import type { Entity } from '@intavia/api-client';

import { CulturalHeritageObjectDetails } from '@/features/entities/cultural-heritage-object-details';
import { GroupDetails } from '@/features/entities/group-details';
import { HistoricalEventDetails } from '@/features/entities/historical-event-details';
import { PersonDetails } from '@/features/entities/person-details';
import { PlaceDetails } from '@/features/entities/place-details';
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

  return (
    <main>
      <EntityDetails entity={entityQuery.data} />
    </main>
  );
}

interface EntityDetailsProps {
  entity: Entity;
}

function EntityDetails(props: EntityDetailsProps): JSX.Element {
  const { entity } = props;

  switch (entity.kind) {
    case 'cultural-heritage-object':
      return <CulturalHeritageObjectDetails entity={entity} />;
    case 'group':
      return <GroupDetails entity={entity} />;
    case 'historical-event':
      return <HistoricalEventDetails entity={entity} />;
    case 'person':
      return <PersonDetails entity={entity} />;
    case 'place':
      return <PlaceDetails entity={entity} />;
  }
}
