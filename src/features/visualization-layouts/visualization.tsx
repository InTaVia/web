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

  const events = visualization.eventIds;
  const persons = visualization.entityIds;

  const filteredPersons =
    persons.length > 0
      ? allPersons.filter((person) => {
          let visible = true;
          if (visualization.visibilities !== undefined) {
            visible =
              visualization.visibilities[person.id] !== undefined
                ? (visualization.visibilities[person.id] as boolean)
                : true;
          }
          return persons.includes(person.id) && visible;
        })
      : [];

  const personEventIds = filteredPersons.flatMap((person) => {
    return person.events ?? [];
  });
  const allPersonEventIds = allPersons.flatMap((person) => {
    return person.events ?? [];
  });

  const filteredEventIds =
    events.length > 0
      ? allPersonEventIds.filter((id) => {
          return events.includes(id);
        })
      : [];

  const visEvents = [...personEventIds, ...filteredEventIds].filter((id) => {
    let visible = true;
    if (visualization.visibilities !== undefined) {
      visible =
        visualization.visibilities[id] !== undefined
          ? Boolean(visualization.visibilities[id])
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
        return <GeoMap />;
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
