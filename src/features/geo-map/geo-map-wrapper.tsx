import type { Entity, Event } from '@intavia/api-client';

import type { ComponentProperty } from '@/features/common/component-property';
import { useDataFromVisualization } from '@/features/common/data/use-data-from-visualization';
import { getColorsById } from '@/features/common/visualization.config';
import type { Visualization } from '@/features/common/visualization.slice';
import { VisualizationLegend } from '@/features/common/visualization-legend';
import { GeoMap } from '@/features/geo-map/geo-map';
import { base } from '@/features/geo-map/geo-map.config';
import { GeoMapClusterMarkerLayer } from '@/features/geo-map/geo-map-cluster-marker-layer';
import { GeoMapDotMarkerLayer } from '@/features/geo-map/geo-map-dot-marker-layer';
import { GeoMapLineLayer } from '@/features/geo-map/geo-map-line-layer';
import { useLineStringFeatureCollection } from '@/features/geo-map/lib/use-line-string-feature-collection';
import { useMarkerCluster } from '@/features/geo-map/lib/use-marker-cluster';
import { usePointFeatureCollection } from '@/features/geo-map/lib/use-point-feature-collection';

interface GeoMapWrapperProps {
  visualization: Visualization;
  autoFitBounds?: boolean;
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
  const { visualization, onToggleHighlight, highlightedByVis, autoFitBounds = false } = props;

  // const dispatch = useAppDispatch();

  //fetch all required data
  const data = useDataFromVisualization({ visualization });
  // console.log(data);

  const { lines } = useLineStringFeatureCollection({
    events: data.events,
    entities: data.entities,
  });
  // console.log(lines);

  const { points } = usePointFeatureCollection({ events: data.events, entities: data.entities });

  const isCluster = visualization.properties!.cluster!.value ?? false;
  const clusterMode = visualization.properties!.clusterMode!.value.value ?? 'donut';
  const renderLines = visualization.properties!.renderLines!.value ?? false;
  const mapStyle = visualization.properties!.mapStyle!.value.value ?? false;

  const cluster = useMarkerCluster({
    clusterByProperty: 'event.kind',
    getColors: getColorsById,
    data: points,
  });

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
    <>
      <GeoMap
        {...base}
        mapStyle={mapStyle}
        // onMove={onMove}
      >
        {/* <GeoMapMarkerLayer circleColors={circleColors} data={points} /> */}
        {renderLines === true && isCluster === false && lines.features.length > 0 && (
          <GeoMapLineLayer data={lines} />
        )}

        {isCluster === false && points.features.length > 0 && (
          <GeoMapDotMarkerLayer
            autoFitBounds={autoFitBounds}
            data={points}
            onToggleSelection={onToggleSelection}
            highlightedByVis={highlightedByVis}
          />
        )}

        {isCluster === true && points.features.length > 0 && (
          //NOTE: does not have to be visulization id - used to keep source id
          <GeoMapClusterMarkerLayer
            id={visualization.id}
            {...cluster}
            isCluster={isCluster}
            clusterType={clusterMode}
          />
        )}
      </GeoMap>
      <div className="absolute bottom-5 right-0">
        <VisualizationLegend events={data.events} entities={data.entities} />
      </div>
    </>
  );
}
