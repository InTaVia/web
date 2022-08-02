import { Fragment } from 'react';

import { useAppSelector } from '@/app/store';
import { selectEntitiesByKind } from '@/features/common/entities.slice';
import type { EntityEvent } from '@/features/common/entity.model';
import type { Visualization } from '@/features/common/visualization.slice';
import { GeoMap } from '@/features/geomap/geo-map';
import { StoryTimeline } from '@/features/storycreator/story-timeline';
import { StoryMapComponent } from '@/features/storycreator/StoryMap';
import { Timeline } from '@/features/timeline/timeline';

interface VisualizationProps {
  visualization: Visualization;
}

export default function VisualisationComponent(props: VisualizationProps): JSX.Element {
  const { visualization } = props;

  const entitiesByKind = useAppSelector(selectEntitiesByKind);
  const allPersons = Object.values(entitiesByKind.person);

  const events = visualization.eventIds;
  const persons = visualization.entityIds;

  console.log(events, persons);

  const filteredPersons =
    persons.length > 0
      ? allPersons.filter((person) => {
          return persons.includes(person.id);
        })
      : [];

  console.log('filteredPersons', filteredPersons);

  const personEvents = filteredPersons.flatMap((person) => {
    return person.history as Array<EntityEvent>;
  });
  const allPersonEvents = allPersons.flatMap((person) => {
    return person.history as Array<EntityEvent>;
  });

  console.log('allPersonEvents', allPersonEvents);
  console.log('personEvents', personEvents);
  console.log('events', events);

  const filteredEvents =
    events.length > 0
      ? allPersonEvents.filter((historyEvent: EntityEvent) => {
          return events.includes(historyEvent.id);
        })
      : [];

  const visEvents = [...personEvents, ...filteredEvents];

  console.log('filteredEvents', filteredEvents);
  const targetIds = filteredEvents.map((event) => {
    return event.targetId;
  });

  console.log('targetIds', targetIds);

  const twiceFilteredPersons = allPersons.filter((person) => {
    return targetIds.includes(person.id);
  });

  const visPersons = [...filteredPersons, ...twiceFilteredPersons];

  console.log('twiceFilteredPersons', twiceFilteredPersons);

  const generateVisualization = (visualization: Visualization) => {
    switch (visualization.type) {
      case 'map':
        return <GeoMap />;
      case 'story-map':
        return <StoryMapComponent events={visEvents} />;
      case 'timeline':
        return <Timeline />;
      case 'story-timeline':
        return <StoryTimeline persons={visPersons} events={visEvents} />;
      default:
        return <div>{`Wrong type of visualization ${visualization.type}!`}</div>;
    }
  };

  return <Fragment>{generateVisualization(visualization)}</Fragment>;
}
