import type { Feature, FeatureCollection } from 'geojson';
import { Layer, Source } from 'react-map-gl';

import type { Person } from '@/features/common/entity.model';
import type { EventType } from '@/features/common/event-types';

interface PersonEventsLayerProps {
  persons: Array<Person>;
  eventTypes: Array<EventType>;
  hovered?: Person['id'] | null;
  setHovered?: (val: Person['id'] | null) => void;
}

export function PersonEventsLayer(props: PersonEventsLayerProps): JSX.Element {
  const { persons, eventTypes } = props;

  const data = usePersonEvents(persons, eventTypes);

  return (
    <Source type="geojson" data={data} lineMetrics>
      <Layer id="person-events" type="line" paint={{ 'line-color': '#999', 'line-opacity': 0.6 }} />
    </Source>
  );
}

function usePersonEvents(
  persons: Array<Person>,
  visibleEventTypes: Array<EventType>,
): FeatureCollection {
  const data: FeatureCollection = { type: 'FeatureCollection', features: [] };

  persons.forEach((person) => {
    if (person.history == null) return;

    const history = person.history
      .filter((event) => {
        if ('place' in event && visibleEventTypes.includes(event.type as EventType)) return true;
        return false;
      })
      // TODO: why are we sorting this?
      .sort((a, b) => {
        return new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime();
      });

    if (history.length <= 1) return;

    const feature: Feature = {
      type: 'Feature',
      properties: {
        id: person.id,
      },
      geometry: {
        type: 'LineString',
        coordinates: history.map((event) => {
          return [event.place!.lng, event.place!.lat];
        }),
      },
    };

    data.features.push(feature);
  });

  return data;
}
