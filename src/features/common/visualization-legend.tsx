import type { Entity, Event } from '@intavia/api-client';
import { cn } from '@intavia/ui';
import { schemePaired } from 'd3-scale-chromatic';
import type { MouseEvent } from 'react';
import { useMemo, useState } from 'react';

import { useHoverState } from '@/app/context/hover.context';
import { useAppSelector } from '@/app/store';
import {
  clearVocabularies,
  selectEntities,
  selectVocabularyEntries,
} from '@/app/store/intavia.slice';
import { IntaviaIcon } from '@/features/common/icons/intavia-icon';
import {
  getEntityKindPropertiesByKind,
  getEventKindPropertiesById,
  temporalColorScales,
} from '@/features/common/visualization.config';
import { getTranslatedLabel } from '@/lib/get-translated-label';

interface VisualizationLegendProps {
  events: Record<Event['id'], Event>;
  entities: Record<Entity['id'], Entity>;
  colorBy: 'entity-identity' | 'event-kind' | 'time';
  entitySorting?: Array<Entity['id']>;
}

export function VisualizationLegend(props: VisualizationLegendProps): JSX.Element {
  const { events, entities, colorBy = 'event-kind', entitySorting } = props;

  const { updateHover } = useHoverState();

  const [hover, setHover] = useState(null);

  const vocabularies = useAppSelector(selectVocabularyEntries);
  const storedEntities = useAppSelector(selectEntities);

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

  const content = useMemo(() => {
    if (colorBy === 'time') {
      return (
        <div className="grid w-24 grid-cols-2 grid-rows-2">
          <div className="col-span-2 text-center">Time &#8594;</div>
          <div
            className="col-span-2 h-5 w-24"
            style={{
              background: `linear-gradient(90deg, ${temporalColorScales.reds
                .map((entry, i) => {
                  return `${entry} ${i / (temporalColorScales.reds.length / 100)}%`;
                })
                .join(', ')})`,
            }}
          ></div>
        </div>
      );
    } else if (colorBy === 'entity-identity') {
      return (
        <>
          {entitySorting?.slice(0, 10).map((entityId, index) => {
            if (entityId in storedEntities) {
              const entityKind = storedEntities[entityId]?.kind;
              const entityKindProperties = getEntityKindPropertiesByKind(entityKind);
              return (
                <>
                  <div
                    key={`entityKind${entityKind}`}
                    className="flex items-center justify-center"
                    style={{
                      opacity: hover != null ? (hover === entityId ? '100%' : '50%') : '100%',
                    }}
                    onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
                      setHover(entityId);
                      updateHover({
                        entities: [entityId],
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
                      className={cn('w-4 h-4')}
                      fill={index < 10 ? schemePaired[index] : 'gray'}
                      stroke={index < 10 ? schemePaired[index] : 'gray'}
                    />
                  </div>
                  <div
                    key={`eventKindLabel${eventKindProperties.label}`}
                    style={{
                      opacity: hover != null ? (hover === entityId ? '100%' : '50%') : '100%',
                    }}
                    onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
                      setHover(entityId);
                      updateHover({
                        entities: [entityId],
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
                    {storedEntities[entityId]?.label.default}
                  </div>
                </>
              );
            }
          })}

          {entitySorting?.length > 10 && (
            <>
              <div
                key={`entityKindOthers`}
                className="flex items-center justify-center"
                /* style={{
              opacity: hover != null ? (hover === entityId ? '100%' : '50%') : '100%',
            }} */
                onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
                  entitySorting.slice(10);
                  updateHover({
                    entities: entitySorting.slice(10),
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
                <div>...</div>
              </div>
              <div
                key={`eventKindLabelOthers`}
                /* style={{
              opacity: hover != null ? (hover === entityId ? '100%' : '50%') : '100%',
            }} */
                onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
                  setHover(entitySorting.slice(10));
                  updateHover({
                    entities: entitySorting.slice(10),
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
                Others
              </div>
            </>
          )}
        </>
      );
    } else {
      return (
        <>
          {eventKindProperties.map((eventKindProperties) => {
            return (
              <>
                <div
                  key={`eventKind${eventKindProperties.label}`}
                  className="flex items-center justify-center"
                  style={{
                    opacity:
                      hover != null
                        ? hover === eventKindProperties.label
                          ? '100%'
                          : '50%'
                        : '100%',
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
                      hover != null
                        ? hover === eventKindProperties.label
                          ? '100%'
                          : '50%'
                        : '100%',
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
              </>
            );
          })}
          {Object.keys(groupedEntities).map((entityKind) => {
            const entityKindProperties = getEntityKindPropertiesByKind(entityKind);
            return (
              <>
                <div
                  key={`entityKind${entityKind}`}
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
              </>
            );
          })}
        </>
      );
    }
  }, [colorBy, eventKindProperties, eventPerEventKind, groupedEntities, hover, updateHover]);

  if (eventKindProperties.length > 0 || Object.keys(groupedEntities).length > 0) {
    return (
      <div className="grid max-w-[250px] cursor-default grid-cols-[min-content_auto] overflow-hidden text-ellipsis whitespace-nowrap border border-solid border-intavia-neutral-400 bg-white p-1 text-sm">
        {content}
      </div>
    );
  } else {
    return <></>;
  }
}
