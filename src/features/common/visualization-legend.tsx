import type { Entity, Event } from '@intavia/api-client';
import { cn } from '@intavia/ui';
import type { MouseEvent } from 'react';
import { Fragment, useState } from 'react';

import { useHoverState } from '@/app/context/hover.context';
import { useAppSelector } from '@/app/store';
import { clearVocabularies, selectVocabularyEntries } from '@/app/store/intavia.slice';
import { IntaviaIcon } from '@/features/common/icons/intavia-icon';
import {
  getEntityKindPropertiesByKind,
  getEventKindPropertiesById,
} from '@/features/common/visualization.config';
import { getTranslatedLabel } from '@/lib/get-translated-label';

interface VisualizationLegendProps {
  events: Record<Event['id'], Event>;
  entities: Record<Entity['id'], Entity>;
}

export function VisualizationLegend(props: VisualizationLegendProps): JSX.Element {
  const { events, entities } = props;

  const { updateHover } = useHoverState();

  const [hover, setHover] = useState(null);

  const vocabularies = useAppSelector(selectVocabularyEntries);

  const groupedEvents: Record<string, Array<Event['id']>> = {};

  const eventKinds = [
    ...new Set(
      Object.values(events).map((event: Event) => {
        const translatedEventKind =
          event.kind in vocabularies
            ? getTranslatedLabel(vocabularies[event.kind].label)
            : event.kind;

        if (translatedEventKind in groupedEvents) {
          groupedEvents[translatedEventKind]?.push(event.id);
        } else {
          groupedEvents[translatedEventKind] = [event.id];
        }
        return translatedEventKind;
      }),
    ),
  ];

  const groupedEntities: Record<string, Array<Entity['id']>> = {};

  const entityKinds = [
    ...new Set(
      Object.values(entities).map((entity: Entity) => {
        if (entity.kind in groupedEntities) {
          groupedEntities[entity.kind]?.push(entity.id);
        } else {
          groupedEntities[entity.kind] = [entity.id];
        }
        return entity.kind;
      }),
    ),
  ];

  const eventPerEventKind: Record<string, Array<Event['id']>> = {};

  const eventKindProperties = [
    ...new Set(
      eventKinds.map((eventKind) => {
        const transEventKind = getEventKindPropertiesById(eventKind);
        if (eventKind in groupedEvents) {
          eventPerEventKind[transEventKind.label] = [
            ...(eventPerEventKind[transEventKind.label] != null
              ? eventPerEventKind[transEventKind.label]
              : []),
            ...groupedEvents[eventKind],
          ] as Array<Event['id']>;
        }
        return transEventKind;
      }),
    ),
  ];

  if (eventKindProperties.length > 0 || Object.keys(groupedEntities).length > 0) {
    return (
      <div className="grid cursor-default grid-cols-[min-content_auto] border border-solid border-intavia-neutral-400 bg-white p-1 text-sm">
        {eventKindProperties.map((eventKindProperties) => {
          return (
            <Fragment key={`eventKind${eventKindProperties.label}`}>
              <div
                className="flex items-center justify-center"
                style={{
                  opacity:
                    hover != null ? (hover === eventKindProperties.label ? '100%' : '50%') : '100%',
                }}
                onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
                  setHover(eventKindProperties.label);
                  updateHover({
                    entities: [],
                    events: eventPerEventKind[eventKindProperties.label] as Array<Event['id']>,
                    clientRect: {
                      left: e.clientX,
                      top: e.clientY,
                    } as DOMRect,
                    pageRect: { left: e.pageX, top: e.pageY } as DOMRect,
                  });
                }}
                onMouseLeave={() => {
                  setHover(null);
                  updateHover(null);
                }}
              >
                <IntaviaIcon
                  icon={eventKindProperties.icon}
                  className={cn('h-3 w-3', eventKindProperties.iconStyle)}
                  strokeWidth={eventKindProperties.strokeWidth}
                />
              </div>
              <div
                key={`eventKindLabel${eventKindProperties.label}`}
                style={{
                  opacity:
                    hover != null ? (hover === eventKindProperties.label ? '100%' : '50%') : '100%',
                }}
                onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
                  setHover(eventKindProperties.label);
                  updateHover({
                    entities: [],
                    events: eventPerEventKind[eventKindProperties.label] as Array<Event['id']>,
                    clientRect: {
                      left: e.clientX,
                      top: e.clientY,
                    } as DOMRect,
                    pageRect: { left: e.pageX, top: e.pageY } as DOMRect,
                  });
                }}
                onMouseLeave={() => {
                  setHover(null);
                  updateHover(null);
                }}
              >
                {eventKindProperties.label}
              </div>
            </Fragment>
          );
        })}
        {Object.keys(groupedEntities).map((entityKind) => {
          const entityKindProperties = getEntityKindPropertiesByKind(entityKind);
          return (
            <Fragment key={`entityKind${entityKind}`}>
              <div
                className="flex items-center justify-center"
                style={{
                  opacity: hover != null ? (hover === entityKind ? '100%' : '50%') : '100%',
                }}
                onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
                  setHover(entityKind);
                  updateHover({
                    entities: groupedEntities[entityKind],
                    events: [],
                    clientRect: {
                      left: e.clientX,
                      top: e.clientY,
                    } as DOMRect,
                    pageRect: { left: e.pageX, top: e.pageY } as DOMRect,
                  });
                }}
                onMouseLeave={() => {
                  setHover(null);
                  updateHover(null);
                }}
              >
                <IntaviaIcon
                  icon={entityKindProperties.icon}
                  className={cn('w-4 h-4', entityKindProperties.iconStyle)}
                />
              </div>
              <div
                key={`entityKindLabel${entityKind}`}
                style={{
                  opacity: hover != null ? (hover === entityKind ? '100%' : '50%') : '100%',
                }}
                onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
                  setHover(entityKind);
                  updateHover({
                    entities: groupedEntities[entityKind],
                    events: [],
                    clientRect: {
                      left: e.clientX,
                      top: e.clientY,
                    } as DOMRect,
                    pageRect: { left: e.pageX, top: e.pageY } as DOMRect,
                  });
                }}
                onMouseLeave={() => {
                  setHover(null);
                  updateHover(null);
                }}
              >
                {getEntityKindPropertiesByKind(entityKind).label}
              </div>
            </Fragment>
          );
        })}
      </div>
    );
  } else {
    return <></>;
  }
}
