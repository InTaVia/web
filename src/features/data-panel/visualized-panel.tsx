import { TrashIcon } from '@heroicons/react/outline';
import type { Entity, Event } from '@intavia/api-client';
import { Button, IconButton, Label } from '@intavia/ui';
import type { MouseEvent } from 'react';
import { useMemo, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store';
import type { Visualization } from '@/features/common/visualization.slice';
import {
  removeAllEntitiesFromVisualization,
  removeAllEventsFromVisualization,
  removeAllTargetEntitiesFromVisualization,
  selectAllVisualizations,
} from '@/features/common/visualization.slice';
import { DataView } from '@/features/data-panel/data-view';
import { VisualizationSelect } from '@/features/data-panel/visualization-select';
import { unique } from '@/lib/unique';
import { useEntities } from '@/lib/use-entities';
import { useEvents } from '@/lib/use-events';

interface VisualizedPanelProps {
  targetHasVisualizations?: boolean;
  currentVisualizationIds?: Array<Visualization['id'] | null> | null;
}

export function VisualizedPanel(props: VisualizedPanelProps): JSX.Element {
  const { currentVisualizationIds = null, targetHasVisualizations = false } = props;
  const dispatch = useAppDispatch();
  const [selectedVisualizations, setSelectedVisualizations] = useState<Array<Visualization['id']>>(
    currentVisualizationIds != null ? currentVisualizationIds.filter(Boolean) : [],
  );

  const visualizations = useAppSelector(selectAllVisualizations);

  const { entityIds, eventIds } = useMemo(() => {
    const entityIds: Array<Entity['id']> = [];
    const eventIds: Array<Event['id']> = [];

    // console.log(selectedVisualizations);

    selectedVisualizations.forEach((visualizationId) => {
      const visualization = visualizations[visualizationId];
      // console.log(visualization);
      entityIds.push(...visualization?.entityIds);
      eventIds.push(...visualization?.eventIds);
    });
    return { entityIds: unique(entityIds), eventIds: unique(eventIds) };
  }, [selectedVisualizations, visualizations]);

  const onVisualizationChange = (visualizations: Array<Visualization['id']>) => {
    setSelectedVisualizations(visualizations);
  };

  const _entities = useEntities(entityIds).data;
  const _events = useEvents(eventIds).data;

  const entities = Array.from(_entities.values());
  const events = Array.from(_events.values());

  function removeAllEntitiesFromVisualizations() {
    if (selectedVisualizations.length === 0) return;
    for (const visualizationId of selectedVisualizations) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (visualizationId != null) {
        dispatch(removeAllEntitiesFromVisualization({ visId: visualizationId }));
      }
    }
  }

  function removeAllEventsFromVisualizations() {
    if (selectedVisualizations.length === 0) return;
    for (const visualizationId of selectedVisualizations) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (visualizationId != null) {
        dispatch(removeAllEventsFromVisualization({ visId: visualizationId }));
        dispatch(removeAllTargetEntitiesFromVisualization({ visId: visualizationId }));
      }
    }
  }

  if (!targetHasVisualizations) {
    return (
      <div className="p-3">
        <Button className="flex w-full place-content-center gap-2" type="button" variant="outline">
          Please add a visualization
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-1 overflow-hidden">
      <div className="p-2">
        <VisualizationSelect
          all={true}
          visualizationIds={currentVisualizationIds as Array<string>}
          onChange={onVisualizationChange}
        />
      </div>

      {entities != null && events != null && entities.length === 0 && events.length === 0 && (
        <div className="p-3">
          <Button
            className="flex w-full place-content-center gap-2"
            type="button"
            variant="outline"
          >
            Please add data to the selected visualization
          </Button>
        </div>
      )}

      {entities.length > 0 && (
        <>
          <div className="flex flex-row items-center justify-between bg-neutral-400 p-2">
            <Label className="text-neutral-100">Entities</Label>
            <IconButton
              className="h-5 w-5"
              variant="destructive"
              label="remove"
              onClick={(e: MouseEvent<HTMLButtonElement>) => {
                removeAllEntitiesFromVisualizations();
                e.preventDefault();
              }}
            >
              <TrashIcon aria-hidden="true" className="h-3 w-3 shrink-0" />
            </IconButton>
          </div>

          <DataView
            entities={entities}
            events={[]}
            groupByEntityKind={false}
            showChronolgyOnly={false}
            targetHasVisualizations={targetHasVisualizations}
            currentVisualizationIds={selectedVisualizations}
            mode={'remove'}
            context={'visualized'}
          />
        </>
      )}

      {events.length > 0 && (
        <>
          <div className="flex flex-row items-center justify-between bg-neutral-400 p-2">
            <Label className="text-neutral-100">Events</Label>
            <IconButton
              className="h-5 w-5"
              variant="destructive"
              label="remove"
              onClick={(e: MouseEvent<HTMLButtonElement>) => {
                removeAllEventsFromVisualizations();
                // console.log('REMOVE ALL EVENTS');
                e.preventDefault();
              }}
            >
              <TrashIcon aria-hidden="true" className="h-3 w-3 shrink-0" />
            </IconButton>
          </div>
          <DataView
            entities={[]}
            events={events}
            groupByEntityKind={false}
            showChronolgyOnly={true}
            targetHasVisualizations={targetHasVisualizations}
            currentVisualizationIds={selectedVisualizations}
            mode={'remove'}
            context={'visualized'}
          />
        </>
      )}
    </div>
  );
}
