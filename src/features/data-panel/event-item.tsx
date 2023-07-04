import { PlusSmIcon, TrashIcon } from '@heroicons/react/outline';
import type { Entity, Event } from '@intavia/api-client';
import { cn, Collapsible, CollapsibleContent, CollapsibleTrigger, IconButton } from '@intavia/ui';
import type { DragEvent, MouseEvent, ReactNode } from 'react';
import { useMemo, useState } from 'react';

import { useHoverState } from '@/app/context/hover.context';
import { useLocale } from '@/app/route/use-locale';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { selectEntities, selectVocabularyEntries } from '@/app/store/intavia.slice';
import type { DataTransferData } from '@/features/common/data-transfer.types';
import { type as mediaType } from '@/features/common/data-transfer.types';
import { IntaviaIcon } from '@/features/common/icons/intavia-icon';
import { getColorsById } from '@/features/common/visualization.config';
import type { Visualization } from '@/features/common/visualization.slice';
import {
  addEventsToVisualization,
  addTargetEntitiesToVisualization,
  removeEventsFromVisualization,
} from '@/features/common/visualization.slice';
import { getTranslatedLabel } from '@/lib/get-translated-label';

interface EventItemProps {
  event: Event;
  targetEntities?: Array<Entity['id']>;
  icon?: ReactNode;
  currentVisualizationIds?: Array<Visualization['id'] | null> | null;
  targetHasVisualizations?: boolean;
  mode?: 'add' | 'none' | 'remove';
  context: 'collections' | 'visualized';
}
export function EventItem(props: EventItemProps): JSX.Element {
  const {
    event,
    targetEntities = null,
    icon = null,
    currentVisualizationIds = null,
    targetHasVisualizations = false,
    mode = 'add',
    context,
  } = props;
  const dispatch = useAppDispatch();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const { hovered, updateHover } = useHoverState();

  const { locale } = useLocale();
  const _entities = useAppSelector(selectEntities);
  const vocabularies = useAppSelector(selectVocabularyEntries);

  const hoverColor = getColorsById(event.kind).foreground;

  function onDragStart(dragEvent: DragEvent<HTMLDivElement>) {
    const data: DataTransferData = {
      type: 'data',
      entities: [],
      events: [event.id],
      targetEntities:
        targetEntities != null
          ? targetEntities
          : targetEntitiesFromRelations != null
          ? targetEntitiesFromRelations
          : [],
    };
    dragEvent.dataTransfer.setData(mediaType, JSON.stringify(data));
  }

  function onMouseEnter(e: MouseEvent) {
    updateHover({
      entities: [],
      events: [event.id],
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
  const targetEntitiesFromRelations = useMemo(() => {
    if (event.relations == null) return null;

    return event.relations
      .map((relation) => {
        const entity = _entities[relation.entity];
        if (entity == null) return null;
        if (entity.kind === 'person') return relation.entity;
      })
      .filter(Boolean);
  }, [_entities, event.relations]);

  function addEventToVisualizations() {
    if (currentVisualizationIds == null || currentVisualizationIds.length === 0) return;
    // console.log(currentVisualizationIds);
    for (const visualizationId of currentVisualizationIds) {
      if (visualizationId != null) {
        dispatch(
          addEventsToVisualization({
            visId: visualizationId,
            events: [event.id],
          }),
        );
        // console.log('TARGTETS', targetEntities, targetEntitiesFromRelations);
        dispatch(
          addTargetEntitiesToVisualization({
            visId: visualizationId,
            targetEntities:
              targetEntities != null
                ? targetEntities
                : targetEntitiesFromRelations != null
                ? targetEntitiesFromRelations
                : [],
          }),
        );
      }
    }
  }

  function removeEventFromVisualizations() {
    if (currentVisualizationIds == null || currentVisualizationIds.length === 0) return;
    for (const visualizationId of currentVisualizationIds) {
      if (visualizationId != null) {
        dispatch(
          removeEventsFromVisualization({
            visId: visualizationId,
            events: [event.id],
          }),
        );
      }
    }
  }

  return (
    <div className="grid border border-neutral-200">
      <Collapsible>
        <CollapsibleTrigger asChild className="cursor-pointer">
          <div
            className={cn(
              'flex w-full flex-row items-left justify-between px-2 py-1 text-left',
              (hovered?.relatedEvents.includes(event.id) === true ||
                hovered?.events.includes(event.id) === true) &&
                'bg-neutral-200',
              isHovered && 'bg-neutral-200',
            )}
            draggable={mode === 'add' ? true : false}
            onDragStart={onDragStart}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <div className="flex flex-col">
              <div className="items-left flex flex-row gap-2">
                {/* <div className="min-w-fit text-neutral-400">{icon}</div> */}
                <p className="p-0 text-xs text-neutral-500">
                  {[event.startDate, event.endDate].filter(Boolean).length === 0
                    ? 'no date'
                    : [event.startDate, event.endDate].filter(Boolean).join(' - ')}{' '}
                  |{' '}
                  {event.kind != null && vocabularies[event.kind] != null
                    ? getTranslatedLabel(vocabularies[event.kind].label)
                    : event.kind}
                  {/* {getTranslatedLabel(vocabularies[event.kind].label)} */}
                </p>
              </div>
              <p>{getTranslatedLabel(event.label)}</p>
            </div>
            <div className="flex min-w-fit flex-row items-center gap-1">
              {isHovered && targetHasVisualizations && mode === 'add' && context === 'collections' && (
                <IconButton
                  className="h-5 w-5"
                  variant="outline"
                  label="add"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    addEventToVisualizations();
                    e.preventDefault();
                  }}
                >
                  <PlusSmIcon aria-hidden="true" className="h-3 w-3 shrink-0" />
                </IconButton>
              )}
              {isHovered &&
                targetHasVisualizations &&
                mode === 'remove' &&
                context === 'visualized' && (
                  <IconButton
                    className="h-5 w-5"
                    variant="destructive"
                    label="remove"
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                      removeEventFromVisualizations();
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
            {event.relations != null &&
              event.relations.map((relation) => {
                const entityId = relation.entity;
                const entity = _entities[entityId];
                if (entity == null) return null;

                function onDragStart(event: DragEvent<HTMLDivElement>) {
                  const data: DataTransferData = {
                    type: 'data',
                    entities: [entityId],
                    events: [],
                  };
                  event.dataTransfer.setData(mediaType, JSON.stringify(data));
                }

                return (
                  <li key={`${entityId}-${relation.role}`}>
                    <div
                      className="cursor-default"
                      draggable={mode === 'add' ? true : false}
                      onDragStart={onDragStart}
                    >
                      <div className="flex h-fit flex-row items-center gap-2 text-xs text-neutral-500">
                        <div className="min-w-fit pl-2">
                          <IntaviaIcon icon={entity.kind} className="h-4 w-4 fill-none" />
                        </div>
                        <p>{getTranslatedLabel(entity.label, locale)}</p>
                        <p>
                          {[
                            `(${
                              vocabularies[relation.role] != null
                                ? getTranslatedLabel(vocabularies[relation.role].label)
                                : null
                            })`,
                            // [event.startDate, event.endDate].filter(Boolean).join(' - '),
                            // place != null ? getTranslatedLabel(place.label) : null,
                          ]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
