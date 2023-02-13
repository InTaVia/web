import type { Entity, Event } from '@intavia/api-client';
import type { Feature } from 'geojson';
import { useCallback } from 'react';
import type { ViewStateChangeEvent } from 'react-map-gl';

import { useAppDispatch } from '@/app/store';
import { useDataFromVisualization } from '@/features/common/data/use-data-from-visualization';
import { eventKindColors, getColorById } from '@/features/common/visualization.config';
import type { Visualization, VisualizationProperty } from '@/features/common/visualization.slice';
import { GeoMap } from '@/features/visualizations/geo-map/geo-map';
import { base } from '@/features/visualizations/geo-map/geo-map.config';
import { GeoMapLineLayer } from '@/features/visualizations/geo-map/geo-map-line-layer';
import { GeoMapMarkerLayer } from '@/features/visualizations/geo-map/geo-map-marker-layer';
import { useLineStringFeatureCollection } from '@/features/visualizations/geo-map/lib/use-line-string-feature-collection';
import { useMarkerCluster } from '@/features/visualizations/geo-map/lib/use-marker-cluster';
import { usePointFeatureCollection } from '@/features/visualizations/geo-map/lib/use-point-feature-collection';

interface GeoMapWrapperProps {
  visualization: Visualization;
  events?: Record<Event['id'], Event>;
  entities?: Record<Entity['id'], Entity>;
  width?: number;
  height?: number;
  properties?: Record<string, VisualizationProperty>;
}

export function GeoMapWrapper(props: GeoMapWrapperProps): JSX.Element {
  const { visualization } = props;

  const dispatch = useAppDispatch();

  //fetch all required data
  const data = useDataFromVisualization({ visualization });
  // console.log(data);

  const { lines } = useLineStringFeatureCollection({
    events: data.events,
    entities: data.entities,
  });
  console.log(lines);

  const { points } = usePointFeatureCollection({ events: data.events, entities: data.entities });
  // console.log(points);

  const isCluster = visualization.properties!.cluster!.value ?? false;
  const clusterMode = visualization.properties!.clusterMode!.value.value ?? 'donut';
  const renderLines = visualization.properties!.renderLines!.value ?? false;
  // console.log(clusterMode);

  const cluster = useMarkerCluster({
    clusterByProperty: 'event.kind',
    getColor: getColorById,
    data: points,
  });

  // console.log(cluster);

  function onChangeHover(features) {
    console.log(features);
  }

  // function onMoveEnd(event: ViewStateChangeEvent) {
  //   console.log(event);
  //   dispatch(setMapViewState({ visId: visualization.id, viewState: event.viewState }));
  // }

  // const onMove = useCallback((event: ViewStateChangeEvent) => {
  //   dispatch(setMapViewState({ visId: visualization.id, viewState: event.viewState }));
  // }, []);

  // const sortEntities = properties['sort']?.value ?? false;
  // const clusterMode = properties['clusterMode']?.value.value ?? 'pie';

  // const stackEntities = properties['stackEntities']?.value ?? false;
  // const showLabels = properties['showLabels']?.value ?? false;
  // const thickness = properties['thickness']?.value ?? 1;
  // const vertical = properties['vertical']?.value.value ?? false;

  return (
    <GeoMap
      {...base}
      // onMove={onMove}
    >
      {/* <GeoMapMarkerLayer circleColors={circleColors} data={points} /> */}
      {renderLines === true && isCluster === false && lines.features.length > 0 && (
        <GeoMapLineLayer data={lines} />
      )}
      {points.features.length > 0 && (
        <GeoMapMarkerLayer
          id={visualization.id}
          {...cluster}
          isCluster={isCluster}
          clusterType={clusterMode}
          onChangeHover={onChangeHover}
        />
      )}
    </GeoMap>
  );
}
