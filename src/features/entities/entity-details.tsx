import type { Entity } from '@intavia/api-client';
import { cn } from '@intavia/ui';
import { useRef } from 'react';

import { BiographyViewer } from '@/features/biography/biography-viewer';
import { NetworkComponent } from '@/features/ego-network/network-component';
import { EntityAttributes } from '@/features/entities/entity-attributes';
import { EntityRelations } from '@/features/entities/entity-relations';
import { EntityTitle } from '@/features/entities/entity-title';
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
  const timelineHeight = 250;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const hasRelations = entity.relations != null && entity.relations.length > 0;

  const hasBiographies =
    entity.kind === 'person' && entity.biographies != null && entity.biographies.length > 0;
  const hasMedia = entity.media != null && entity.media.length > 0;

  return (
    <div className="mx-auto my-6 grid w-full max-w-6xl grid-flow-row gap-4 divide-y bg-white p-8">
      <EntityTitle entity={entity} />
      <div className="grid grid-cols-2 gap-4 pt-4">
        {hasMedia ? (
          <div className="border">
            <MediaViewer mediaResourceIds={entity.media!} />
          </div>
        ) : null}

        <EntityAttributes entity={entity} />
      </div>
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4 pt-4">
          {hasRelations ? (
            <div
              className={cn('relative border w-full', `h-[${networkMapHeight}px]`)}
              ref={networkParent}
            >
              <NetworkComponent
                visualization={{
                  id: `ego-network-${entity.id}`,
                  type: 'ego-network',
                  name: `ego-network-${entity.id}`,
                  entityIds: [entity.id],
                  targetEntityIds: [],
                  eventIds: [],
                }}
                width={halfWidth}
                height={400}
              />{' '}
            </div>
          ) : null}
          <div className={cn('relative border w-full', `h-[${networkMapHeight}px]`)}>
            <GeoMapWrapper
              visualization={{
                id: `ego-map-${entity.id}`,
                type: 'map',
                name: `ego-map-${entity.id}`,
                entityIds: [entity.id],
                targetEntityIds: [],
                eventIds: [],
                properties: {
                  cluster: {
                    type: 'boolean',
                    id: 'cluster',
                    value: false,
                    editable: false,
                    label: 'Cluster',
                  },
                  clusterMode: {
                    type: 'select',
                    id: 'clusterMode',
                    label: 'Cluster Style',
                    value: {
                      name: 'Donut',
                      value: 'donut',
                    },
                    options: [
                      {
                        name: 'Donut',
                        value: 'donut',
                      },
                      {
                        name: 'Dot',
                        value: 'dot',
                      },
                    ],
                    editable: false,
                  },
                  renderLines: {
                    type: 'boolean',
                    id: 'renderLines',
                    value: true,
                    editable: false,
                    label: 'Connect events chronologically with lines (for each entity)',
                  },
                  mapStyle: {
                    type: 'select',
                    id: 'mapStyle',
                    label: 'Map Style',
                    value: {
                      name: 'Dataviz (Light Gray)',
                      value:
                        'https://api.maptiler.com/maps/dataviz-light/style.json?key=Z2X5tY0jlK44wsp6Kl4i',
                    },
                    editable: false,
                  },
                },
              }}
              highlightedByVis={{
                entities: [],
                events: [],
              }}
              width={halfWidth}
              height={networkMapHeight}
            />
          </div>
        </div>
        <div className={cn('relative w-full border h-64', `h-[${timelineHeight}px]`)}>
          <VisualisationComponent
            visualization={{
              id: `ego-timeline-${entity.id}`,
              type: 'timeline',
              name: `ego-timeline-${entity.id}`,
              entityIds: [entity.id],
              targetEntityIds: [],
              eventIds: [],
              properties: {
                cluster: {
                  type: 'boolean',
                  id: 'cluster',
                  value: true,
                  editable: false,
                  label: 'Cluster',
                },
              },
            }}
            highlightedByVis={{
              entities: [],
              events: [],
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 pt-4">
        {hasRelations ? <EntityRelations relations={entity.relations} /> : null}
        {hasBiographies ? <BiographyViewer biographyIds={entity.biographies!} /> : null}
      </div>
    </div>
  );
}
