import type { Feature, FeatureCollection } from 'geojson';
import { Layer, Source } from 'react-map-gl';

import type { EntityEvent, Person as Entity } from '@intavia/api-client';
import type { EventType } from '@/features/common/event-types';

interface EntityEventsLineStringLayerProps {
  entities: Array<Entity>;
  eventTypes: Array<EventType>;
}

export function EntityEventsLineStringLayer(props: EntityEventsLineStringLayerProps): JSX.Element {
  const { entities, eventTypes } = props;

  const data: FeatureCollection = { type: 'FeatureCollection', features: [] };

  entities.forEach((entity) => {
    if (entity.history == null) return;

    const history = entity.history
      .filter((event) => {
        if (eventTypes.includes(event.type)) return true;
        return false;
      })
      .sort((a, b) => {
        return new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime();
      });

    const feature = createLineStringFeature(entity.id, history);

    if (feature != null) {
      data.features.push(feature);
    }
  });

  return (
    <Source type="geojson" data={data} lineMetrics>
      <Layer
        id="entity-events-line-strings"
        type="line"
        paint={{ 'line-color': '#999', 'line-opacity': 0.6 }}
      />
    </Source>
  );
}

function createLineStringFeature(id: string, events: Array<EntityEvent>) {
  if (events.length <= 1) return null;

  const coordinates: Array<[number, number]> = [];

  events.forEach((event) => {
    if (event.place) {
      coordinates.push([event.place.lng, event.place.lat]);
    }
  });

  const feature: Feature = {
    type: 'Feature',
    properties: { id },
    geometry: { type: 'LineString', coordinates },
  };

  return feature;
}
