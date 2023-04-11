import type { Entity, Event, Place } from '@intavia/api-client';
import type { Feature, FeatureCollection, Point } from 'geojson';
import { useMemo } from 'react';

import { useAppSelector } from '@/app/store';
import { selectEntitiesByKind } from '@/app/store/intavia.slice';
import { createPointFeature } from '@/features/geo-map/lib/create-point-feature';
import { isValidPoint } from '@/features/geo-map/lib/is-valid-point';

interface UsePointFeatureCollectionParams {
  events: Array<Event>;
  entities: Array<Entity>;
}

interface UsePointFeatureCollectionResult {
  points: FeatureCollection<Point, { event: Event; place: Place }>;
}

export function usePointFeatureCollection(
  params: UsePointFeatureCollectionParams,
): UsePointFeatureCollectionResult {
  const { events, entities } = params;

  const places = useAppSelector(selectEntitiesByKind).place;

  const points: FeatureCollection<Point, { event: Event; place: Place }> = useMemo(() => {
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

    const features: Array<Feature<Point, { event: Event; place: Place }>> = [];
    const nonSpatialEvents: Array<Event> = [];

    events.forEach((event) => {
      const relatedPlaces = getRelatedPlaces(event);
      if (relatedPlaces == null || relatedPlaces.length === 0) {
        nonSpatialEvents.push(event);
        return;
      }

      //FIXME: if there is more than one location for an array make MultiPointFeature
      relatedPlaces.forEach((place) => {
        features.push(createPointFeature({ place, event }));
      });
    });

    return {
      type: 'FeatureCollection',
      features,
    };
  }, [events, entities]);

  return {
    points,
  };
}
