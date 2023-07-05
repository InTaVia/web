import type { Entity, Event } from '@intavia/api-client';
import { keyBy } from '@stefanprobst/key-by';

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

  // const dispatch = useAppDispatch();

  //fetch all required data
  const data = useDataFromVisualization({ visualization });
  // console.log(data);

  // functions
  const { lines, spatioTemporalEvents, spatialEvents, temporalEvents, noneEvents } =
    useLineStringFeatureCollection({
      events: data.events,
      entities: data.entities,
    });
  // console.log(temporalEvents, noneEvents);

  const { points } = usePointFeatureCollection({ events: data.events, entities: data.entities });

  const isCluster = visualization.properties!.cluster!.value ?? false;
  const clusterMode = visualization.properties!.clusterMode!.value.value ?? 'donut';
  const renderLines = visualization.properties!.renderLines!.value ?? false;
  const mapStyle = visualization.properties!.mapStyle!.value.value ?? false;
  const colorBy = visualization.properties!.colorBy!.value.value ?? 'event-kind';

  const cluster = useMarkerCluster({
    clusterByProperty: 'event.kind',
    getColors: getColorsById,
    data: points,
  });

  function onToggleSelection(ids: Array<Event['id']>) {
    onToggleHighlight!([], ids);
  }

  // function onMoveEnd(event: ViewStateChangeEvent) {
  //   console.log(event);
  //   dispatch(setMapViewState({ visId: visualization.id, viewState: event.viewState }));
  // }

  // const onMove = useCallback((event: ViewStateChangeEvent) => {
  //   dispatch(setMapViewState({ visId: visualization.id, viewState: event.viewState }));
  // }, []);

  return (
    <>
      <GeoMap
        {...base}
        mapStyle={mapStyle}
        // onMove={onMove}
      >
        {/* <GeoMapMarkerLayer circleColors={circleColors} data={points} /> */}
        {renderLines === true && isCluster === false && lines.features.length > 0 && (
          <GeoMapLineLayer data={lines} id={visualization.id} colorMode={colorBy} />
        )}

        {isCluster === false && points.features.length > 0 && (
          <GeoMapDotMarkerLayer
            data={points}
            onToggleSelection={onToggleSelection}
            highlightedByVis={highlightedByVis}
            colorBy={colorBy}
          />
        )}

        {isCluster === true && points.features.length > 0 && (
          //NOTE: does not have to be visulization id - used to keep source id
          <GeoMapClusterMarkerLayer
            id={visualization.id}
            {...cluster}
            isCluster={isCluster}
            clusterType={clusterMode}
            onToggleSelection={onToggleSelection}
            highlightedByVis={highlightedByVis}
          />
        )}
      </GeoMap>
      <div className="absolute bottom-5 right-0">
        <VisualizationLegend
          events={keyBy(data.events, (e) => {
            return e.id;
          })}
          entities={keyBy(data.entities, (e) => {
            return e.id;
          })}
        />
      </div>
    </>
  );
}
