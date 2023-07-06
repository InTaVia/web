import type { EmptyObject } from '@intavia/api-client';
import { lineString as turfLineString } from '@turf/helpers';
import turfLength from '@turf/length';
import { scaleLinear } from 'd3-scale';
import { schemeTableau10 as colors } from 'd3-scale-chromatic';
import type { Feature, FeatureCollection, LineString } from 'geojson';
import type { LinePaint } from 'mapbox-gl';
import { type LayerProps, Layer, Source } from 'react-map-gl';

import type { SpaceTime } from '@/features/geo-map/lib/use-line-string-feature-collection';
import { getTemporalExtent } from '@/features/timeline/timeline';
import { colorScale, timeScale } from '@/lib/temporal-coloring';

export interface GeoMapLineLayerProps<T extends EmptyObject = EmptyObject> {
  id: string;
  data: FeatureCollection<LineString, T>;
  onChangeHover?: (feature: Feature<LineString, T> | null) => void;
  colorMode: 'entity-identity' | 'time';
}

/**
 * GeoJSON line layer for geo-visualisation.
 */
export function GeoMapLineLayer<T extends EmptyObject = EmptyObject>(
  props: GeoMapLineLayerProps<T>,
): JSX.Element {
  const { id, data, colorMode } = props;

  return (
    <Source id={`LineSource${id}`} data={data} type="geojson" lineMetrics={true}>
      {data.features.map((feature, index) => {
        if (feature.geometry.coordinates.length <= 1) return;

        const filteredLayer: LayerProps = {
          id: `LineSource${id}LineLayer${feature.id}`,
          source: `LineSource${id}`,
          type: 'line',
          filter: ['==', ['get', 'id', ['get', 'entity']], feature.id],
        };

        let paint: LinePaint = {};
        if (colorMode === 'time') {
          const gradient = generateGradient(feature);
          paint = {
            'line-width': 4,
            'line-opacity': 1,
            'line-gradient': ['interpolate', ['linear'], ['line-progress'], ...gradient],
          };
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        } else if (colorMode === 'entity-identity') {
          paint = {
            'line-color': colors[index > 9 ? 9 : index],
            'line-opacity': 0.6,
            'line-width': 4,
          };
        } else {
          paint = {
            'line-color': '#666666',
            'line-opacity': 0.6,
            'line-width': 4,
          };
        }

        return (
          <Layer key={`LineSource${id}LineLayer${feature.id}`} {...filteredLayer} paint={paint} />
        );
      })}
    </Source>
  );
}

function generateGradient(feature: Feature) {
  const line = turfLineString(feature.geometry.coordinates);
  const length = turfLength(line, { units: 'kilometers' });
  const distanceNormalized = scaleLinear().domain([0, length]).range([0, 1]);
  const timeScaleNormalized = timeScale(...getTemporalExtent([feature.properties!.events!]));
  let accumulatedLength = 0;

  const gradient = feature.properties!.spaceTime!.map(
    (positionDate: SpaceTime, index: number, spaceTime: Array<SpaceTime>) => {
      if (index === 0) {
        return [0, colorScale(timeScaleNormalized(positionDate.date))];
      }
      const segmentLength = turfLength(
        turfLineString([spaceTime[index - 1]!.position, positionDate.position]),
      );
      const spatialDelta =
        distanceNormalized(accumulatedLength + segmentLength) -
        distanceNormalized(accumulatedLength);

      let correctionOffset = 0;
      if (spatialDelta === 0) {
        correctionOffset = 0.00000000001;
      }

      const additionalStops = [];

      const temporalDelta =
        timeScaleNormalized(positionDate.date) - timeScaleNormalized(spaceTime[index - 1]!.date);

      //FIXME: 1/7 depends on colorscheme time curves red because there are 7 stops!
      if (temporalDelta > 1 / 7) {
        const additionalStopCount = Math.floor(temporalDelta / (1 / 7) - 2);
        if (additionalStopCount > 0) {
          const spatialStep = spatialDelta / (additionalStopCount + 1);
          const temporalStep = temporalDelta / (additionalStopCount + 1);
          for (let i = 1; i <= additionalStopCount; i++) {
            additionalStops.push(
              distanceNormalized(accumulatedLength) + spatialStep * i + correctionOffset * i,
            );
            additionalStops.push(
              colorScale(timeScaleNormalized(spaceTime[index - 1]!.date) + temporalStep * i),
            );
          }
        }
      }

      accumulatedLength = accumulatedLength + segmentLength + correctionOffset;

      return [
        ...additionalStops,
        distanceNormalized(accumulatedLength),
        colorScale(timeScaleNormalized(positionDate.date)),
      ];
    },
  );
  return gradient.flatMap((i: number | string) => {
    return i;
  });
}
