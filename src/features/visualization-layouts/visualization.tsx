import type { Entity, EntityEventRelation, Event } from '@intavia/api-client';

import { useAppSelector } from '@/app/store';
import { selectEntitiesByKind, selectEvents } from '@/app/store/intavia.slice';
import type { Visualization } from '@/features/common/visualization.slice';
//import { StoryTimeline } from '@/features/storycreator/story-timeline';
import { TimelineComponent } from '@/features/timelineV2/timelineComponent';
import { GeoMapWrapper } from '@/features/visualizations/geo-map/geo-map-wrapper';
import { useElementDimensions } from '@/lib/use-element-dimensions';
import { useElementRef } from '@/lib/use-element-ref';

interface VisualizationProps {
  visualization: Visualization;
  highlightedByVis: never | { entities: Array<Entity['id']>; events: Array<Event['id']> };
  onToggleHighlight?: (
    entities: Array<Entity['id'] | null>,
    events: Array<Event['id'] | null>,
  ) => void;
}

export default function VisualisationComponent(props: VisualizationProps): JSX.Element {
  const { visualization, onToggleHighlight, highlightedByVis } = props;

  const entitiesByKind = useAppSelector(selectEntitiesByKind);
  const allPersons = Object.values(entitiesByKind.person);
  const allEvents = useAppSelector(selectEvents);

  const eventIds = visualization.eventIds;
  const personIds = visualization.entityIds;

  const [containerElement, setContainerElement] = useElementRef();

  const filteredPersons =
    personIds.length > 0
      ? allPersons.filter((person) => {
          let visible = true;
          if (visualization.visibilities !== undefined) {
            visible =
              visualization.visibilities[person.id] !== undefined
                ? (visualization.visibilities[person.id] as boolean)
                : true;
          }
          return personIds.includes(person.id) && visible;
        })
      : [];

  const personEvents = filteredPersons.flatMap((person) => {
    return person.events ?? [];
  });
  const allPersonEvents = allPersons.flatMap((person) => {
    if ('events' in person) {
      return person.events;
    } else {
      return [];
    }
  });

  const filteredEvents =
    eventIds.length > 0
      ? allPersonEvents.filter((eventId) => {
          return eventIds.includes(eventId as string);
        })
      : [];

  const visEvents = [...personEvents, ...filteredEvents].filter((eventId) => {
    let visible = true;
    if (visualization.visibilities !== undefined) {
      visible =
        visualization.visibilities[eventId as string] !== undefined
          ? Boolean(visualization.visibilities[eventId as string])
          : true;
    }
    return visible;
  });

  const targetIds: Array<string> = []; // FIXME:

  const twiceFilteredPersons = allPersons.filter((person) => {
    return targetIds.includes(person.id);
  });

  const visPersons = [...filteredPersons, ...twiceFilteredPersons];

  const visPersonsAsObject = Object.fromEntries(
    visPersons.map((entry) => {
      return [entry.id, entry];
    }),
  );

  const visPersonsEventIds = visPersons.flatMap((entity: Entity) => {
    return entity.relations !== undefined
      ? entity.relations.map((rel: EntityEventRelation) => {
          return rel.event;
        })
      : [];
  });

  /* export const pick = (obj: Record<string, any>, keys: Array<string>) => {
  return Object.fromEntries(
    keys
      .filter((key) => {
        return key in obj;
      })
      .map((key) => {
        return [key, obj[key]];
      }),
  );
}; */

  const pickedEvents = Object.fromEntries(
    visPersonsEventIds
      .filter((id) => {
        return id in allEvents;
      })
      .map((id) => {
        return [id, allEvents[id]];
      }),
  );

  const rect = useElementDimensions({ element: containerElement });

  const width = rect != null ? rect.width : 50;
  const height = rect != null ? rect.height : 50;

  const generateVisualization = (visualization: Visualization) => {
    switch (visualization.type) {
      case 'map':
        return (
          <GeoMapWrapper
            visualization={visualization}
            onToggleHighlight={onToggleHighlight}
            highlightedByVis={highlightedByVis}
          />
        );
      case 'timeline':
        return (
          <TimelineComponent
            entities={visPersonsAsObject}
            events={pickedEvents}
            width={width}
            height={height}
            properties={visualization.properties}
            // onToggleHighlight={onToggleHighlight}
          />
        );
      default:
        return <div>{`Wrong type of visualization ${visualization.type}!`}</div>;
    }
  };

  return (
    <div ref={setContainerElement} className={'h-full w-full'}>
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        {generateVisualization(visualization)}
      </div>
    </div>
  );
}
