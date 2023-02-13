import type { Entity, Event, Place } from '@intavia/api-client';
import { assert } from '@stefanprobst/assert';
import type { Feature, LineString } from 'geojson';

import { isValidPoint } from '@/features/visualizations/geo-map/lib/is-valid-point';

interface CreateLineFeatureParams {
  entity: Entity;
  events: Array<Event>;
  id: string;
  places: Array<Place>;
}

export function createLineFeature(
  params: CreateLineFeatureParams,
): Feature<LineString, { entity: Entity; events: Array<Event>; places: Array<Place> }> {
  const { entity, events, id, places } = params;

  places.forEach((place) => {
    assert(place.geometry);
    assert(place.geometry.coordinates);
    assert(isValidPoint(place.geometry));
  });

  const line: Feature<LineString, { entity: Entity; events: Array<Event>; places: Array<Place> }> =
    {
      id: id,
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: places.map((place) => {
          return place.geometry.coordinates;
        }),
      },

      properties: {
        entity,
        events,
        places,
      },
    };

  return line;
}
