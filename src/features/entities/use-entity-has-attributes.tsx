import type { Entity } from '@intavia/api-client';

export function useEntityHasAttributes(entity: Entity): boolean {
  const alternativeLabels = entity.alternativeLabels?.filter((label) => {
    return label.default !== entity.label.default;
  });

  if (alternativeLabels !== undefined && alternativeLabels.length > 0) return true;
  if (entity.description !== undefined && entity.description !== '') return true;
  if (entity.linkedIds !== undefined && entity.linkedIds.length > 0) return true;

  if (entity.kind === 'person' && entity.gender !== undefined) return true;
  if (entity.kind === 'person' && entity.occupations !== undefined && entity.occupations.length > 0)
    return true;

  return false;
}
