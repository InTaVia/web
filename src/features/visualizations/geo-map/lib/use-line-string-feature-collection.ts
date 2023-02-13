import type { Entity, EntityEventRelation, Event, Place } from '@intavia/api-client';
import { assert } from '@stefanprobst/assert';
import { keyBy } from '@stefanprobst/key-by';
import type { Feature, FeatureCollection, LineString } from 'geojson';
import { useMemo } from 'react';

import { useAppSelector } from '@/app/store';
import { selectEntitiesByKind } from '@/app/store/intavia.slice';
import { createLineFeature } from '@/features/visualizations/geo-map/lib/create-line-feature';
import { isValidDate } from '@/features/visualizations/geo-map/lib/is-valid-date';
import { isValidPoint } from '@/features/visualizations/geo-map/lib/is-valid-point';

interface UseLineStringFeatureCollectionParams {
  events: Array<Event>;
  entities: Array<Entity>;
}

interface UseLineStringFeatureCollectionResult {
  lines: FeatureCollection<
    LineString,
    { entity: Entity; events: Array<Event>; places: Array<Place> }
  >;
}

export function useLineStringFeatureCollection(
  params: UseLineStringFeatureCollectionParams,
): UseLineStringFeatureCollectionResult {
  const { events, entities } = params;

  const places = useAppSelector(selectEntitiesByKind).place;

  const lines: FeatureCollection<
    LineString,
    { entity: Entity; events: Array<Event>; places: Array<Place> }
  > = useMemo(() => {
    function getRelatedPlaces(event: Event): Array<Place> | null {
      const relatedPlaces: Array<Place> = [];

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (event.relations == null) return null;

      event.relations.forEach((relation) => {
        if (relation.entity in places) {
          const place = places[relation.entity]!;
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (place.kind !== 'place') return null;
          if (place.geometry == null) return null;
          if (!isValidPoint(place.geometry)) return null;
          relatedPlaces.push(place);
        }
      });

      return relatedPlaces;
    }

    const features: Array<
      Feature<LineString, { entity: Entity; events: Array<Event>; places: Array<Place> }>
    > = [];

    const spatioTemporalEvents: Array<Event> = [];
    const spatialEvents: Array<Event> = [];
    const temporalEvents: Array<Event> = [];
    const noneEvents: Array<Event> = [];
    events.forEach((event) => {
      const hasDate =
        ('startDate' in event && isValidDate(new Date(event.startDate as string))) ||
        ('endDate' in event && isValidDate(new Date(event.endDate as string)));

      const relatedPlaces = getRelatedPlaces(event);

      if (relatedPlaces == null || relatedPlaces.length === 0) {
        if (hasDate) {
          temporalEvents.push(event);
        } else {
          noneEvents.push(event);
        }
      } else {
        if (hasDate) {
          spatioTemporalEvents.push(event);
        } else {
          spatialEvents.push(event);
        }
      }
    });

    // console.log({ spatioTemporalEvents, spatialEvents, temporalEvents, noneEvents });

    const sortedEvents = spatioTemporalEvents.sort((eventA, eventB) => {
      const sortDateA =
        'startDate' in eventA
          ? new Date(eventA.startDate as string)
          : new Date(eventA.endDate as string);
      const sortDateB =
        'startDate' in eventB
          ? new Date(eventB.startDate as string)
          : new Date(eventB.endDate as string);
      return sortDateA - sortDateB;
    });

    console.log('sortedEvents', sortedEvents);
    //       return eventsById![eventId1].sortDate - eventsById![eventId2].sortDate;
    //     });

    // .map((event) => {
    //   if (event.hasDate) {
    //     return {
    //       ...event,
    //       sortDate:
    //         'startDate' in event
    //           ? new Date(event.startDate as string)
    //           : new Date(event.endDate as string),
    //     };
    //   } else {
    //     return event;
    //   }
    // });

    // const eventsById = keyBy(_events, (event) => {
    //   return event.id;
    // });

    // console.log(eventsById);

    // iterate over event ids of entities
    // for (const entity of entities) {
    //   if (entity.kind === 'place') continue;
    //   if (!('relations' in entity) || entity.relations == null) continue;
    //   const eventsSortedByDate: Array<EntityEventRelation> = entity.relations
    //     .filter((relation) => {
    //       const eventId = relation.event;
    //       if (!(eventId in eventsById) || eventsById![eventId!] == null) return null;
    //       return eventsById![eventId!].hasDate;
    //     })
    //     .filter(Boolean)
    //     .sort((eventId1, eventId2) => {
    //       return eventsById![eventId1].sortDate - eventsById![eventId2].sortDate;
    //     });

    //   console.log(eventsSortedByDate);

    //   const eventsWithPlaceAndDate: Array<Event['id']> = eventsSortedByDate.filter((eventId) => {
    //     return (
    //       eventsById![eventId!].relatedPlaces != null &&
    //       eventsById![eventId!].relatedPlaces.length > 0 &&
    //       eventsById![eventId!].hasDate
    //     );
    //   });

    // const eventsWithPlaceOnly: Array<Event['id']> = entity.events.filter((eventId) => {
    //   return eventsById![eventId].hasPlace && !eventsById![eventId].hasDate;
    // });

    // const eventsWithoutDateAndPlace: Array<Event['id']> = entity.events.filter((eventId) => {
    //   return !eventsById![eventId].hasPlace && !eventsById![eventId].hasDate;
    // });

    // console.log(eventsSortedByDate)
    // console.log(eventsWithPlaceOnly)
    // console.log(eventsWithoutDateAndPlace)
    // console.log(eventsWithPlaceAndDate)

    for (const entity of entities) {
      if (entity.kind === 'place') continue;
      // Option A: one line string per entity
      const relatedEvents = sortedEvents.filter((event) => {
        return event.relations
          .map((relation) => {
            return relation.entity;
          })
          .includes(entity.id);
      });
      features.push(
        createLineFeature({
          entity,
          events: relatedEvents,

          // eventsWithPlaceAndDate.map((eventId) => {
          //   return eventsById[eventId] as Event;
          // }),
          id: entity.id,
          places: relatedEvents
            .flatMap((event) => {
              return getRelatedPlaces(event);
            })
            .filter(Boolean),
        }),
      );
      // Option B: multiple line strings per entity
      // console.log('entity', entity.id);
      // for (let i = 0; i < eventsWithPlaceAndDate.length - 1; i++) {
      //   console.log(eventsWithPlaceAndDate[i], ' => ', eventsWithPlaceAndDate[i + 1]);
      // }
    }

    return {
      type: 'FeatureCollection',
      features,
    };
  }, [events, entities]);

  return {
    lines,
  };
}
