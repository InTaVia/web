import { Fragment } from 'react';

import { useAppSelector } from '@/app/store';
import { selectEntitiesByKind } from '@/app/store/intavia.slice';
import type { Visualization } from '@/features/common/visualization.slice';
//import { StoryTimeline } from '@/features/storycreator/story-timeline';
import { StoryMapComponent } from '@/features/storycreator/StoryMap';
import { Timeline } from '@/features/timelineV2/timeline';

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

  const generateVisualization = (visualization: Visualization) => {
    switch (visualization.type) {
      case 'map':
        return <StoryMapComponent properties={visualization.properties} events={visEvents} />; //GeoMap
      case 'story-map':
        return <StoryMapComponent properties={visualization.properties} events={visEvents} />;
      case 'story-timeline':
        return (
          <Timeline
            entities={visPersonsAsObject}
            events={{}}
            width={200}
            height={200}
            amount={100}
            vertical={false}
            thickness={1}
            showLabels={true}
            overlap={false}
            cluster={false}
            stackEntities={false}
            sortEntities={false}
            clusterMode="pie"
          />
        );
      /* case 'story-timeline':
        return <StoryTimeline persons={visPersons} events={visEvents} />; */
      default:
        return <div>{`Wrong type of visualization ${visualization.type}!`}</div>;
    }
  };

  return <Fragment>{generateVisualization(visualization)}</Fragment>;
}
