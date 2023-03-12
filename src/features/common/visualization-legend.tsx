import type { Entity, Event } from '@intavia/api-client';
import type { MouseEvent } from 'react';

import { useHoverState } from '@/app/context/hover.context';
import { useAppSelector } from '@/app/store';
import { clearVocabularies, selectVocabularyEntries } from '@/app/store/intavia.slice';
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

  const createShapeSVG = (shape, color) => {
    switch (shape) {
      case 'rectangle':
        return <rect width={16} height={16} fill={color} />;
      case 'dot':
        return <circle r={8} cx={8} cy={8} fill={color} />;
      case 'triangle':
        return <polygon points="0,16 8,0 16,16" fill={color} />;
      case 'ellipse':
        return <ellipse rx={12 * (5 / 7)} ry={12 / 2} cy={8} cx={8} fill={color} />;
      default:
        break;
    }
  };

  if (eventKindProperties.length > 0 || Object.keys(groupedEntities).length > 0) {
    return (
      <div className="grid cursor-default grid-cols-[min-content_auto] border border-solid border-intavia-neutral-400 bg-white p-1 text-sm">
        {eventKindProperties.map((eventKindProperties) => {
          return (
            <>
              <div
                className="flex items-center justify-center"
                onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
                  updateHover({
                    entities: [],
                    events: eventPerEventKind[eventKindProperties.label] as Array<Event['id']>,
                    clientRect: {
                      left: e.clientX,
                      top: e.clientY,
                    } as DOMRect,
                  });
                }}
                onMouseLeave={() => {
                  updateHover(null);
                }}
              >
                <svg width={16} height={16} style={{ transform: 'scale(0.6)' }}>
                  {createShapeSVG(eventKindProperties.shape, eventKindProperties.color.background)}
                </svg>
              </div>
              <div
                onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
                  updateHover({
                    entities: [],
                    events: eventPerEventKind[eventKindProperties.label] as Array<Event['id']>,
                    clientRect: {
                      left: e.clientX,
                      top: e.clientY,
                    } as DOMRect,
                  });
                }}
                onMouseLeave={() => {
                  updateHover(null);
                }}
              >
                {eventKindProperties.label}
              </div>
            </>
          );
        })}
        {Object.keys(groupedEntities).map((entityKind) => {
          return (
            <>
              <div
                className="flex items-center justify-center"
                onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
                  updateHover({
                    entities: groupedEntities[entityKind],
                    events: [],
                    clientRect: {
                      left: e.clientX,
                      top: e.clientY,
                    } as DOMRect,
                  });
                }}
                onMouseLeave={() => {
                  updateHover(null);
                }}
              >
                <svg width={16} height={16} style={{ transform: 'scale(0.6)' }}>
                  {createShapeSVG(
                    getEntityKindPropertiesByKind(entityKind).shape,
                    getEntityKindPropertiesByKind(entityKind).color.background,
                  )}
                </svg>
              </div>
              <div
                onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
                  updateHover({
                    entities: groupedEntities[entityKind],
                    events: [],
                    clientRect: {
                      left: e.clientX,
                      top: e.clientY,
                    } as DOMRect,
                  });
                }}
                onMouseLeave={() => {
                  updateHover(null);
                }}
              >
                {getEntityKindPropertiesByKind(entityKind).label}
              </div>
            </>
          );
        })}
      </div>
    );
  } else {
    return <></>;
  }
}
