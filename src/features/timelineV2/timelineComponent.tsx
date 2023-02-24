import type { Entity, Event } from '@intavia/api-client';
import { useState } from 'react';

import type { VisualizationProperty } from '@/features/common/visualization.slice';
import { Timeline } from '@/features/timelineV2/timeline';
import Button from '@/features/ui/Button';

interface TimelineProps {
  events: Record<Event['id'], Event>;
  entities: Record<Entity['id'], Entity>;
  width?: number;
  height?: number;
  properties?: Record<string, VisualizationProperty>;
}

export function TimelineComponent(props: TimelineProps): JSX.Element {
  const { events, entities, properties = {}, width = 0, height = 0 } = props;

  const [zoom, setZoom] = useState<number>(0);

  const sortEntities = properties['sort']?.value ?? false;
  const clusterMode = properties['clusterMode']?.value.value ?? 'pie';
  const cluster = properties['cluster']?.value ?? false;
  const stackEntities = properties['stackEntities']?.value ?? false;
  const showLabels = properties['showLabels']?.value.value ?? undefined;
  const thickness = properties['thickness']?.value ?? 1;
  const vertical = properties['vertical']?.value.value ?? undefined;
  const diameter = properties['diameter']?.value ?? 14;

  return (
    <>
      <Timeline
        events={events}
        entities={entities}
        width={width}
        height={height}
        vertical={vertical}
        thickness={thickness}
        showLabels={showLabels}
        overlap={false}
        cluster={cluster}
        stackEntities={stackEntities}
        sortEntities={sortEntities}
        clusterMode={clusterMode}
        diameter={diameter}
        zoom={zoom}
      />
      <div className="absolute top-1 right-1 z-50">
        <Button
          onClick={() => {
            setZoom(Math.min(zoom + 1, 20));
          }}
        >
          +
        </Button>
        <Button
          onClick={() => {
            setZoom(Math.max(zoom - 1, 0));
          }}
        >
          -
        </Button>
      </div>
    </>
  );
}
