import type { Entity } from '@intavia/api-client';
import { cn } from '@intavia/ui';
import { useRef } from 'react';
import { Marker } from 'react-map-gl';

import { BiographyViewer } from '@/features/biography/biography-viewer';
import { NetworkComponent } from '@/features/ego-network/network-component';
import { EntityAttributes } from '@/features/entities/entity-attributes';
import { EntityRelations } from '@/features/entities/entity-relations';
import { EntityTitle } from '@/features/entities/entity-title';
import { useEntityHasAttributes } from '@/features/entities/use-entity-has-attributes';
import { useEntityHasGeometry } from '@/features/entities/use-entity-has-geometry';
import { useVisualizationSetup } from '@/features/entities/use-visualization-setup';
import { GeoMap } from '@/features/geo-map/geo-map';
import { GeoMapWrapper } from '@/features/geo-map/geo-map-wrapper';
import { MediaViewer } from '@/features/media/media-viewer';
import VisualisationComponent from '@/features/visualization-layouts/visualization';
import { useResizeObserverDeprecated } from '@/lib/useResizeObserver';

interface EntityDetailsProps {
  entity: Entity;
}

export function EntityDetails(props: EntityDetailsProps): JSX.Element {
  const { entity } = props;

  const networkParent = useRef<HTMLDivElement>(null);
  const [halfWidth, _] = useResizeObserverDeprecated(networkParent);
  const networkMapHeight = 400;

  const hasMedia = entity.media != null && entity.media.length > 0;
  const hasAttributes = useEntityHasAttributes(entity);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const hasRelations = entity.relations != null && entity.relations.length > 0;
  const hasGeometry =
    useEntityHasGeometry(entity) || (entity.kind === 'place' && entity.geometry !== undefined);
  const hasBiographies =
    entity.kind === 'person' && entity.biographies != null && entity.biographies.length > 0;

  const [networkVisualization, mapVisualization, timelineVisualization] = useVisualizationSetup(
    entity.id,
  );

  return (
    <div className="mx-auto my-6 grid w-full max-w-6xl grid-flow-row gap-4 divide-y bg-white p-8">
      <EntityTitle entity={entity} />
      {(hasMedia || hasAttributes) && (
        <div className="grid grid-cols-2 gap-4 pt-4">
          {hasMedia && (
            <div className="border">
              <MediaViewer mediaResourceIds={entity.media!} />
            </div>
          )}

          {hasAttributes && <EntityAttributes entity={entity} />}
        </div>
      )}
      {(hasRelations || hasGeometry) && (
        <div className="grid gap-4">
          <div className="flex flex-row gap-4 pt-4">
            {hasRelations ? (
              <div
                className={cn(
                  'relative border',
                  `h-[${networkMapHeight}px]`,
                  `${hasGeometry ? 'w-1/2' : 'w-full'}`,
                )}
                ref={networkParent}
              >
                <NetworkComponent
                  visualization={networkVisualization}
                  width={halfWidth}
                  height={networkMapHeight}
                />{' '}
              </div>
            ) : null}
            {hasGeometry && (
              <div
                className={cn(
                  'relative border',
                  `h-[${networkMapHeight}px]`,
                  `${hasRelations ? 'w-1/2' : 'w-full'}`,
                )}
              >
                {renderMap()}
              </div>
            )}
          </div>
          {hasRelations && entity.kind !== 'place' && (
            <div className={cn('relative w-full border overflow-y-hidden', `h-[250px]`)}>
              <VisualisationComponent
                visualization={timelineVisualization}
                highlightedByVis={{
                  entities: [],
                  events: [],
                }}
              />
            </div>
          )}
        </div>
      )}
      {(hasRelations || hasBiographies) && (
        <div className="grid grid-cols-2 items-start gap-4 pt-4">
          {hasRelations && <EntityRelations relations={entity.relations} />}
          {hasBiographies && <BiographyViewer biographyIds={entity.biographies!} />}
        </div>
      )}
    </div>
  );

  function renderMap(): JSX.Element {
    if (entity.kind === 'place') {
      return (
        <GeoMap
          initialViewState={{
            latitude: entity.geometry!.coordinates[1],
            longitude: entity.geometry!.coordinates[0],
            zoom: 8,
          }}
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        >
          <Marker
            key={`marker-${entity.id}`}
            longitude={entity.geometry!.coordinates[0]}
            latitude={entity.geometry!.coordinates[1]}
            anchor="bottom"
          ></Marker>
        </GeoMap>
      );
    }

    return (
      <GeoMapWrapper
        visualization={mapVisualization}
        highlightedByVis={{
          entities: [],
          events: [],
        }}
        width={halfWidth}
        height={networkMapHeight}
        autoFitBounds={true}
      />
    );
  }
}
