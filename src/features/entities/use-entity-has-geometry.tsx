import type { Entity } from '@intavia/api-client';

import { useRelatedEntities } from '@/lib/use-related-entities';

export function useEntityHasGeometry(entity: Entity): boolean {
  const relatedEntities = useRelatedEntities(entity);

  for (const entity of relatedEntities) {
    if (entity.kind === 'place' && entity.geometry !== undefined) return true;
  }

  return false;
}
