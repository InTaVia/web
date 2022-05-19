import { color as d3color } from 'd3-color';
import { scaleOrdinal } from 'd3-scale';
import { schemeTableau10 } from 'd3-scale-chromatic';
import { Fragment } from 'react';
import { Marker } from 'react-map-gl';

import type { Person } from '@/features/common/entity.model';
import type { EventType } from '@/features/common/event-types';
import { eventTypes } from '@/features/common/event-types';

interface PinLayerProps {
  persons: Array<Person>;
  showEventTypes: Array<EventType>;
  hovered?: Person['id'] | null;
  setHovered?: (val: Person['id'] | null) => void;
}

interface Pin {
  lng: number;
  lat: number;
  id: string;
  eventType: EventType;
}

export function PinLayer(props: PinLayerProps): JSX.Element {
  const { persons, showEventTypes, hovered, setHovered } = props;
  // filter each person's history for events with places

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

  // const sortedAsc = [...arr1].sort((objA, objB) => {
  //   return objA.date.getTime() - objB.date.getTime();
  // });

  const markers = eventsWithPlacesByTypeByPerson
    .flatMap((person) => {
      const history = person?.historyPlaces;
      if (history == null) return;
      return history.map((relation) => {
        return {
          lng: relation.place?.lng,
          lat: relation.place?.lat,
          id: person?.id,
          eventType: relation.type,
        };
      });
    })
    .filter(Boolean) as Array<Pin>;

  const size = 16;

  const additionalEventColors = scaleOrdinal()
    .domain(Object.keys(eventTypes))
    .range(schemeTableau10);

  const handleMouseEnter = (entityId: Person['id']) => {
    setHovered?.(entityId);
  };

  const handleMouseLeave = () => {
    setHovered?.(null);
  };

  return (
    <Fragment>
      {markers.map((marker, index) => {
        const color: string = additionalEventColors(marker.eventType) as string;
        const colorFill = d3color(color)?.brighter(2)?.formatHex() as string;
        return (
          <Marker
            key={`person-${marker.id}-${index}`}
            anchor="center"
            latitude={marker.lat}
            longitude={marker.lng}
          >
            <svg
              height={size}
              viewBox="0 0 24 24"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => {
                return handleMouseEnter(marker.id);
              }}
              onMouseLeave={handleMouseLeave}
            >
              {['beginning', 'end'].includes(marker.eventType) ? (
                <circle
                  cx={24 / 2}
                  cy={24 / 2}
                  r={size / 2}
                  fill={colorFill}
                  stroke={marker.id.startsWith(hovered as string) ? 'salmon' : color}
                  strokeWidth={marker.id.startsWith(hovered as string) ? 4 : 2}
                />
              ) : (
                <path
                  d={`M ${12} ${12 + size / 2} l ${size / 2} ${-size / 2} ${-size / 2} ${
                    -size / 2
                  } ${-size / 2} ${size / 2} z`}
                  fill={colorFill}
                  stroke={marker.id.startsWith(hovered as string) ? 'salmon' : color}
                  strokeWidth={marker.id.startsWith(hovered as string) ? 4 : 2}
                />
              )}
            </svg>
          </Marker>
        );
      })}
    </Fragment>
  );
}
