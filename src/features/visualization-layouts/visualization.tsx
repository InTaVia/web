import { Fragment } from 'react';

import { useAppSelector } from '@/app/store';
import { selectEntitiesByKind } from '@/app/store/intavia.slice';
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

  const eventIds = visualization.eventIds;
  const personIds = visualization.entityIds;

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
      ? allPersonEvents.filter((event) => {
          return eventIds.includes(event.id);
        })
      : [];

  const visEvents = [...personEvents, ...filteredEvents].filter((event) => {
    let visible = true;
    if (visualization.visibilities !== undefined) {
      visible =
        visualization.visibilities[event.id] !== undefined
          ? Boolean(visualization.visibilities[event.id])
          : true;
    }
    return visible;
  });

  const targetIds: Array<string> = []; // FIXME:

  const twiceFilteredPersons = allPersons.filter((person) => {
    return targetIds.includes(person.id);
  });

  const visPersons = [...filteredPersons, ...twiceFilteredPersons];

  const generateVisualization = (visualization: Visualization) => {
    switch (visualization.type) {
      case 'map':
        return <StoryMapComponent properties={visualization.properties} events={visEvents} />; //GeoMap
      case 'story-map':
        return <StoryMapComponent properties={visualization.properties} events={visEvents} />;
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
