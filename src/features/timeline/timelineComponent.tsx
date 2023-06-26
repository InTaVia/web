import { MinusSmIcon, PlusSmIcon } from '@heroicons/react/solid';
import type { Entity, Event } from '@intavia/api-client';
import { IconButton } from '@intavia/ui';
import { useState } from 'react';

import type { ComponentProperty } from '@/features/common/component-property';
import { VisualizationLegend } from '@/features/common/visualization-legend';
import { Timeline } from '@/features/timeline/timeline';

interface TimelineProps {
  events: Record<Event['id'], Event>;
  entities: Record<Entity['id'], Entity>;
  width?: number;
  height?: number;
  properties?: Record<string, ComponentProperty>;
  onToggleHighlight?: (
    entities: Array<Entity['id'] | null>,
    events: Array<Event['id'] | null>,
  ) => void;
  highlightedByVis: never | { entities: Array<Entity['id']>; events: Array<Event['id']> };
}

export function TimelineComponent(props: TimelineProps): JSX.Element {
  const {
    events,
    entities,
    properties = {},
    width = 0,
    height = 0,
    onToggleHighlight,
    highlightedByVis,
  } = props;

  const [zoom, setZoom] = useState<number>(0);

  const sortEntities = properties['sort']?.value ?? false;
  const clusterMode = properties['clusterMode']?.value.value ?? 'pie';
  const cluster = properties['cluster']?.value ?? false;
  const stackEntities = properties['stackEntities']?.value ?? false;
  const showLabels = properties['showLabels']?.value.value ?? undefined;
  const thickness = properties['thickness']?.value ?? 1;
  const vertical = properties['vertical']?.value.value ?? undefined;
  const diameter = properties['diameter']?.value ?? 14;
  const fontSize = properties['fontSize']?.value ?? 10;

  const filteredEntities = Object.fromEntries(
    Object.entries(entities).filter(([key, val]) => {
      return val.kind !== 'place';
    }),
  );

  return (
    <>
      <Timeline
        events={events}
        entities={filteredEntities}
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
        fontSize={fontSize}
        zoom={zoom}
        setZoom={setZoom}
        onToggleHighlight={onToggleHighlight}
        highlightedByVis={highlightedByVis}
      />
      <div className="absolute top-1 right-1 flex gap-1">
        <IconButton
          size="xs"
          label="Zoom in"
          onClick={() => {
            setZoom(Math.min(zoom + 1, 20));
          }}
        >
          <PlusSmIcon className="h-4 w-4" />
        </IconButton>
        <IconButton
          size="xs"
          label="Zoom out"
          onClick={() => {
            setZoom(Math.max(zoom - 1, 0));
          }}
        >
          <MinusSmIcon className="h-4 w-4" />
        </IconButton>
      </div>
      <div className="absolute bottom-0 right-0">
        <VisualizationLegend events={events} entities={filteredEntities} />
      </div>
    </>
  );
}
