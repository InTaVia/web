import { useRef } from 'react';

import { useAppSelector } from '@/app/store';
import { selectEntitiesByKind } from '@/features/common/entities.slice';
import type { EntityEvent, StoryEvent } from '@/features/common/entity.model';
import styles from '@/features/timeline/timeline.module.css';
import { selectZoomToTimeRange } from '@/features/timeline/timeline.slice';
import { TimelineSvg } from '@/features/timeline/timeline-svg';

interface StoryTimelineProps {
  events: Array<EntityEvent | StoryEvent>;
}

export function StoryTimeline(props: StoryTimelineProps): JSX.Element {
  const { events } = props;

  const zoomToTimeRange = useAppSelector(selectZoomToTimeRange);

  const parent = useRef<HTMLDivElement>(null);

  const entitiesByKind = useAppSelector(selectEntitiesByKind);
  const allPersons = Object.values(entitiesByKind.person);

  const persons = events.flatMap((event) => {
    return allPersons.filter((p) => {
      return p.id === event.targetId;
    });
  });

  return (
    <div className={styles['timeline-wrapper']} ref={parent}>
      <TimelineSvg
        parentRef={parent}
        persons={persons}
        events={events}
        zoomToData={zoomToTimeRange}
        renderLabel={true}
      />
    </div>
  );
}
