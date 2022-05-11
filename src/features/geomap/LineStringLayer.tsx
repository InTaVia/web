import { Layer, Source } from 'react-map-gl';

import type { Person } from '@/features/common/entity.model';
import type { EventType } from '@/pages/coordination.page';

interface LineStringLayerProps {
  persons: Array<Person>;
  showEventTypes: Array<EventType>;
  hovered?: Person['id'] | null;
  setHovered?: (val: Person['id'] | null) => void;
}
export function LineStringLayer(props: LineStringLayerProps): JSX.Element {
  const { persons, showEventTypes } = props;

  const eventsWithPlacesByTypeByPerson = persons.map((person) => {
    // person history using flatMap to remove events without place
    const personHistory = person.history?.flatMap((historyEvent) => {
      if ('place' in historyEvent && showEventTypes.includes(historyEvent.type as EventType)) {
        return [{ ...historyEvent, date: new Date(historyEvent.date as IsoDateString) }];
      } else {
        return [];
      }
    });
    if (personHistory == null) return;
    // returns sorted person history events by date
    return {
      ...person,
      historyPlaces: personHistory.sort((objA, objB) => {
        return objA.date.getTime() - objB.date.getTime();
      }),
    };
  });

  // Create a GeoJson Line Layer from Events
  const lineStringsFeatureCollection = {
    type: 'FeatureCollection',
    features: eventsWithPlacesByTypeByPerson
      .map((person, index) => {
        const history = person?.historyPlaces;
        if (history == null || history.length <= 1) return;
        return {
          type: 'Feature',
          id: index,
          properties: {
            id: person?.id,
          },
          geometry: {
            type: 'LineString',
            coordinates: history
              .map((relation) => {
                if ('place' in relation) {
                  return [relation.place?.lng, relation.place?.lat];
                } else {
                  return;
                }
              })
              .filter(Boolean),
          },
        };
      })
      .filter(Boolean),
  };

  const layerStyle = {
    id: 'life-lines',
    type: 'line',
    paint: {
      'line-color': '#999',
      'line-opacity': 0.6,
    },
  };

  return (
    <Source
      id="my-data"
      type="geojson"
      data={lineStringsFeatureCollection as any}
      lineMetrics={true}
    >
      <Layer {...layerStyle} />
    </Source>
  );
}
