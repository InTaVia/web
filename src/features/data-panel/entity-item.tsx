import { IdentificationIcon, PlusSmIcon, TrashIcon } from '@heroicons/react/outline';
import type { Entity, Event } from '@intavia/api-client';
import { cn, Collapsible, CollapsibleContent, CollapsibleTrigger, IconButton } from '@intavia/ui';
import { useRouter } from 'next/router';
import type { DragEvent, MouseEvent, ReactNode } from 'react';
import { useMemo, useState } from 'react';

import { useHoverState } from '@/app/context/hover.context';
import { useLocale } from '@/app/route/use-locale';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { selectEvents } from '@/app/store/intavia.slice';
import type { DataTransferData } from '@/features/common/data-transfer.types';
import { type as mediaType } from '@/features/common/data-transfer.types';
import type { Visualization } from '@/features/common/visualization.slice';
import {
  addEntitiesToVisualization,
  removeEntitiesFromVisualization,
} from '@/features/common/visualization.slice';
import { EventItem } from '@/features/data-panel/event-item';
import { getTranslatedLabel } from '@/lib/get-translated-label';

interface EntityItemProps {
  entity: Entity;
  icon?: ReactNode;
  currentVisualizationIds?: Array<Visualization['id'] | null> | null;
  targetHasVisualizations?: boolean;
  mode?: 'add' | 'remove';
  context: 'collections' | 'visualized';
}
export function EntityItem(props: EntityItemProps): JSX.Element {
  const {
    entity,
    icon = null,
    currentVisualizationIds = null,
    targetHasVisualizations = false,
    mode = 'add',
    context,
  } = props;

  const dispatch = useAppDispatch();
  const router = useRouter();

  const [isHovered, setIsHovered] = useState<boolean>(false);
  const { hovered, updateHover } = useHoverState();

  const { locale } = useLocale();
  const _events = useAppSelector(selectEvents);
  // const vocabularies = useAppSelector(selectVocabularyEntries);

  function addEntityToVisualizations() {
    if (currentVisualizationIds == null || currentVisualizationIds.length === 0) return;

    for (const visualizationId of currentVisualizationIds) {
      if (visualizationId != null) {
        dispatch(
          addEntitiesToVisualization({
            visId: visualizationId,
            entities: [entity.id],
          }),
        );
      }
    }
  }

  function removeEntityFromVisualizations() {
    if (currentVisualizationIds == null || currentVisualizationIds.length === 0) return;
    for (const visualizationId of currentVisualizationIds) {
      if (visualizationId != null) {
        dispatch(
          removeEntitiesFromVisualization({
            visId: visualizationId,
            entities: [entity.id],
          }),
        );
      }
    }
  }

  function onDragStart(event: DragEvent<HTMLDivElement>) {
    const data: DataTransferData = { type: 'data', entities: [entity.id], events: [] };
    event.dataTransfer.setData(mediaType, JSON.stringify(data));
  }

  function onMouseEnter(e: MouseEvent) {
    updateHover({
      entities: [entity.id],
      events: [],
      clientRect: {
        left: e.clientX,
        top: e.clientY,
      } as DOMRect,
    });
    setIsHovered(true);
    //update workspace hovered
  }

  function onMouseLeave() {
    updateHover(null);
    setIsHovered(false);
    //update workspace hovered
  }

  const relatedEvents = useMemo(() => {
    const now = Date.now();
    const relatedEvents = entity.relations
      .map((relation) => {
        return _events[relation.event];
      })
      .filter(Boolean);
    const temporallySortedrelatedEvents = relatedEvents.sort((eventA: Event, eventB: Event) => {
      const sortDateA =
        'startDate' in eventA
          ? new Date(eventA.startDate as string)
          : 'endDate' in eventA
          ? new Date(eventA.endDate as string)
          : now;
      const sortDateB =
        'startDate' in eventB
          ? new Date(eventB.startDate as string)
          : 'endDate' in eventB
          ? new Date(eventB.endDate as string)
          : now;
      return sortDateA - sortDateB;
    });
    return temporallySortedrelatedEvents;
  }, [entity]);

  return (
    <div className="grid border border-neutral-200">
      <Collapsible>
        <CollapsibleTrigger asChild>
          <div
            className={cn(
              'flex w-full flex-row items-center justify-between px-2 py-1 text-left cursor-pointer',
              (hovered?.relatedEntities.includes(entity.id) === true ||
                hovered?.entities.includes(entity.id) === true) &&
                'bg-neutral-300',
              isHovered && 'bg-neutral-300',
            )}
            draggable={mode === 'add' ? true : false}
            onDragStart={onDragStart}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <div className="flex flex-row items-center gap-2">
              <div className="min-w-fit text-neutral-400">{icon}</div>
              {getTranslatedLabel(entity.label)}
            </div>
            <div className=" itmes-center flex min-w-fit flex-row gap-1">
              {isHovered && (
                <IconButton
                  className="h-5 w-5"
                  variant="default"
                  label="details"
                  onClick={() => {
                    updateHover(null);
                    void router.push(`/entities/${entity.id}`);
                  }}
                >
                  <IdentificationIcon aria-hidden="true" className="h-3 w-3 shrink-0" />
                </IconButton>
              )}
              {isHovered && targetHasVisualizations && mode === 'add' && (
                <IconButton
                  className="h-5 w-5"
                  variant="outline"
                  label="add"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    addEntityToVisualizations();
                    e.preventDefault();
                  }}
                >
                  <PlusSmIcon aria-hidden="true" className="h-3 w-3 shrink-0" />
                </IconButton>
              )}
              {isHovered && targetHasVisualizations && mode === 'remove' && (
                <IconButton
                  className="h-5 w-5"
                  variant="destructive"
                  label="remove"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    removeEntityFromVisualizations();
                    e.preventDefault();
                  }}
                >
                  <TrashIcon aria-hidden="true" className="h-3 w-3 shrink-0" />
                </IconButton>
              )}
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <ul className="grid gap-0 text-sm" role="list">
            {entity.relations != null &&
              relatedEvents.map((event, index) => {
                return (
                  <EventItem
                    key={index}
                    event={event}
                    targetEntities={[entity.id]}
                    currentVisualizationIds={currentVisualizationIds}
                    targetHasVisualizations={targetHasVisualizations}
                    mode={context === 'collections' ? 'add' : 'none'}
                    context={context}
                  />
                );
              })}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
