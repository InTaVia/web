import type { Entity, Event } from '@intavia/api-client';

import { useAppDispatch } from '@/app/store';
import type { ComponentProperty } from '@/features/common/component-property';
import { useDataFromVisualization } from '@/features/common/data/use-data-from-visualization';
import { getColorById } from '@/features/common/visualization.config';
import type { Visualization } from '@/features/common/visualization.slice';
import { GeoMap } from '@/features/visualizations/geo-map/geo-map';
import { base } from '@/features/visualizations/geo-map/geo-map.config';
import { GeoMapClusterMarkerLayer } from '@/features/visualizations/geo-map/geo-map-cluster-marker-layer';
import { GeoMapDotMarkerLayer } from '@/features/visualizations/geo-map/geo-map-dot-marker-layer';
import { GeoMapLineLayer } from '@/features/visualizations/geo-map/geo-map-line-layer';
import { useLineStringFeatureCollection } from '@/features/visualizations/geo-map/lib/use-line-string-feature-collection';
import { useMarkerCluster } from '@/features/visualizations/geo-map/lib/use-marker-cluster';
import { usePointFeatureCollection } from '@/features/visualizations/geo-map/lib/use-point-feature-collection';

interface GeoMapWrapperProps {
  visualization: Visualization;
  highlightedByVis: never | { entities: Array<Entity['id']>; events: Array<Event['id']> };
  events?: Record<Event['id'], Event>;
  entities?: Record<Entity['id'], Entity>;
  width?: number;
  height?: number;
  properties?: Record<string, ComponentProperty>;
  onToggleHighlight?: (
    entities: Array<Entity['id'] | null>,
    events: Array<Event['id'] | null>,
  ) => void;
}

export function GeoMapWrapper(props: GeoMapWrapperProps): JSX.Element {
  const { visualization, onToggleHighlight, highlightedByVis } = props;

  const dispatch = useAppDispatch();

  //fetch all required data
  const data = useDataFromVisualization({ visualization });
  // console.log(data);

  const { lines } = useLineStringFeatureCollection({
    events: data.events,
    entities: data.entities,
  });
  // console.log(lines);

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
    return;
    // console.log(features);
  }

  function onToggleSelection(ids) {
    // console.log(ids);
    onToggleHighlight([], ids as Array<Event['id']>);
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

      {isCluster === false && points.features.length > 0 && (
        <GeoMapDotMarkerLayer
          data={points}
          onChangeHover={onChangeHover}
          onToggleSelection={onToggleSelection}
          highlightedByVis={highlightedByVis}
        />
      )}

      {isCluster === true && points.features.length > 0 && (
        <GeoMapClusterMarkerLayer
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
