import { useRef } from 'react';

import { useAppSelector } from '@/app/store';
import type { EntityEvent, Person, StoryEvent } from '@/features/common/entity.model';
import styles from '@/features/timeline/timeline.module.css';
import { selectZoomToTimeRange } from '@/features/timeline/timeline.slice';
import { TimelineSvg } from '@/features/timeline/timeline-svg';

interface StoryTimelineProps {
  events: Array<EntityEvent | StoryEvent>;
  persons: Array<Person>;
}

export function StoryTimeline(props: StoryTimelineProps): JSX.Element {
  const { events, persons } = props;

  const zoomToTimeRange = useAppSelector(selectZoomToTimeRange);

  const parent = useRef<HTMLDivElement>(null);

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
