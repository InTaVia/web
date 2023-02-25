import type { Entity, Event } from '@intavia/api-client';

import { getEventKindPropertiesById } from '@/features/common/visualization.config';

interface VisualizationLegendProps {
  events: Record<Event['id'], Event>;
  entities: Record<Entity['id'], Entity>;
}

export function VisualizationLegend(props: VisualizationLegendProps): JSX.Element {
  const { events, entities } = props;

  const eventKinds = [
    ...new Set(
      Object.values(events).map((event: Event) => {
        return event.kind;
      }),
    ),
  ];

  const eventKindProperties = [
    ...new Set(
      eventKinds.map((eventKind) => {
        return getEventKindPropertiesById(eventKind);
      }),
    ),
  ];

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

  return (
    <div className="grid grid-cols-2 gap-2 border border-solid border-intavia-gray-400 bg-white p-1">
      {eventKindProperties.map((eventKindProperties) => {
        return (
          <>
            <div className="flex items-center justify-center">
              <svg width={16} height={16}>
                {createShapeSVG(eventKindProperties.shape, eventKindProperties.color.background)}
              </svg>
            </div>
            <div>{eventKindProperties.label}</div>
          </>
        );
      })}
    </div>
  );
}
