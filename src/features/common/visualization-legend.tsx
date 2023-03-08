import type { Entity, Event } from '@intavia/api-client';
import type { MouseEvent } from 'react';

import { useHoverState } from '@/app/context/hover.context';
import { getEventKindPropertiesById } from '@/features/common/visualization.config';

interface VisualizationLegendProps {
  events: Record<Event['id'], Event>;
  entities: Record<Entity['id'], Entity>;
}

export function VisualizationLegend(props: VisualizationLegendProps): JSX.Element {
  const { events, entities } = props;

  const { updateHover } = useHoverState();

  const groupedEvents: Record<string, Array<Event['id']>> = {};

  console.log(events);

  const eventKinds = [
    ...new Set(
      Object.values(events).map((event: Event) => {
        if (event.kind in groupedEvents) {
          groupedEvents[event.kind]?.push(event.id);
        } else {
          groupedEvents[event.kind] = [event.id];
        }
        return event.kind;
      }),
    ),
  ];

  console.log(groupedEvents);

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

  console.log(eventPerEventKind);

  const createShapeSVG = (shape, color) => {
    switch (shape) {
      case 'rectangle':
        return <rect width={16} height={16} fill={color} />;
      case 'dot':
        return <circle r={8} cx={8} cy={8} fill={color} />;
      default:
        break;
    }
  };

  if (eventKindProperties.length > 0) {
    return (
      <div className="grid grid-cols-[min-content_auto] gap-2 border border-solid border-intavia-gray-400 bg-white p-1">
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
                <svg width={16} height={16}>
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
      </div>
    );
  } else {
    return <></>;
  }
}
