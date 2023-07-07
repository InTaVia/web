import type { Entity, Event, Place } from '@intavia/api-client';
import { keyBy } from '@stefanprobst/key-by';
import type { Feature, FeatureCollection, LineString, Position } from 'geojson';
import { useMemo } from 'react';

import { useAppSelector } from '@/app/store';
import { selectEntitiesByKind } from '@/app/store/intavia.slice';
import { createLineFeature } from '@/features/geo-map/lib/create-line-feature';
import { isValidDate } from '@/features/geo-map/lib/is-valid-date';
import { isValidPoint } from '@/features/geo-map/lib/is-valid-point';
import { getTemporalExtent } from '@/features/timeline/timeline';
import { timeScale } from '@/lib/temporal-coloring';

interface UseLineStringFeatureCollectionParams {
  events: Array<Event>;
  entities: Array<Entity>;
  groupByEntities: Array<Entity['id']>;
}

type LineFeatureCollection = FeatureCollection<
  LineString,
  { entity: Entity; events: Array<Event>; places: Array<Place> }
>;

interface UseLineStringFeatureCollectionResult {
  lines: LineFeatureCollection;
  spatioTemporalEvents: Array<Event>;
  spatialEvents: Array<Event>;
  temporalEvents: Array<Event>;
  noneEvents: Array<Event>;
  timeScaleNormalizedByEntities: Record<Entity['id'], any>;
}

export interface SpaceTime {
  position: Position;
  date: Date;
}

export function useLineStringFeatureCollection(
  params: UseLineStringFeatureCollectionParams,
): UseLineStringFeatureCollectionResult {
  const { events, entities, groupByEntities } = params;
  const entitiesById = keyBy(entities, (entity) => {
    return entity.id;
  });

  const places: Record<Place['id'], Place> = useAppSelector(selectEntitiesByKind).place;

  const [
    lines,
    spatioTemporalEvents,
    spatialEvents,
    temporalEvents,
    noneEvents,
    timeScaleNormalizedByEntities,
  ] = useMemo(() => {
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

    function getSpaceTime(event: Event): Array<SpaceTime> | null {
      const spaceTime: Array<SpaceTime> = [];

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (event.relations == null) return null;

      event.relations.forEach((relation) => {
        if (relation.entity in places) {
          const place = places[relation.entity]!;

          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (place.kind !== 'place') return null;
          if (place.geometry == null) return null;
          if (!isValidPoint(place.geometry)) return null;
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const date: string = (event.startDate ?? event.endDate)!;
          spaceTime.push({
            position: place.geometry.coordinates,
            date: new Date(date),
          });
        }
      });

      return spaceTime;
    }

    const features: Array<
      Feature<LineString, { entity: Entity; events: Array<Event>; places: Array<Place> }>
    > = [];

    // TODO : also return "unmappable" events
    const spatioTemporalEvents: Array<Event> = [];
    const spatialEvents: Array<Event> = [];
    const temporalEvents: Array<Event> = [];
    const noneEvents: Array<Event> = [];

    events.forEach((event) => {
      const hasDate =
        ('startDate' in event &&
          event.startDate != null &&
          isValidDate(new Date(event.startDate as string))) ||
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
      return sortDateA.getTime() - sortDateB.getTime();
    });

    // console.log('sortedEvents', sortedEvents);
    // console.log(groupByEntities);
    const timeScaleNormalizedByEntities = [];
    for (const entityId of groupByEntities) {
      const entity = entitiesById[entityId];
      if (entity == null) continue;
      if (entity.kind === 'place') continue;

      // Option A: one line string per entity
      const relatedEvents = sortedEvents.filter((event) => {
        return event.relations
          .map((relation) => {
            return relation.entity;
          })
          .includes(entity.id);
      });

      if (relatedEvents.length <= 1) {
        if (relatedEvents.length === 1) {
          // const date: string = (relatedEvents[0]!.startDate ?? relatedEvents[0]!.endDate)!;
          console.log(relatedEvents[0]!.id, atob(relatedEvents[0]!.id));
          timeScaleNormalizedByEntities.push({
            id: entity.id,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            timeScaleNormalized: (date: Date) => {
              return 0;
            },
          });
        }
        continue;
      }

      features.push(
        createLineFeature({
          entity,
          events: relatedEvents,
          id: entity.id,
          places: relatedEvents
            .flatMap((event) => {
              return getRelatedPlaces(event);
            })
            .filter(Boolean),
          spaceTime: relatedEvents
            .flatMap((event) => {
              return getSpaceTime(event);
            })
            .filter(Boolean),
        }),
      );

      timeScaleNormalizedByEntities.push({
        id: entity.id,
        timeScaleNormalized: timeScale(...getTemporalExtent([relatedEvents])),
      });

      // Option B: multiple line strings per entity

      // console.log('entity', entity.id);
      // for (let i = 0; i < eventsWithPlaceAndDate.length - 1; i++) {
      //   console.log(eventsWithPlaceAndDate[i], ' => ', eventsWithPlaceAndDate[i + 1]);
      // }
    }

    return [
      {
        type: 'FeatureCollection',
        features,
      } as LineFeatureCollection,
      spatioTemporalEvents,
      spatialEvents,
      temporalEvents,
      noneEvents,
      keyBy(timeScaleNormalizedByEntities, (item) => {
        return item.id;
      }),
    ];
  }, [events, places, groupByEntities, entitiesById]);

  return {
    lines,
    spatioTemporalEvents,
    spatialEvents,
    temporalEvents,
    noneEvents,
    timeScaleNormalizedByEntities,
  };
}
