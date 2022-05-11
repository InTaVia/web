import { useRef } from 'react';

import { selectEntitiesByKind } from '@/features/common/entities.slice';
import type { Person } from '@/features/common/entity.model';
import { useAppSelector } from '@/features/common/store';
import styles from '@/features/timeline/timeline.module.css';
import { selectZoomToTimeRange } from '@/features/timeline/timeline.slice';
import { TimelineSvg } from '@/features/timeline/TimelineSvg';

export function Timeline(): JSX.Element {
  const entities = useAppSelector(selectEntitiesByKind);
  const persons = Object.values(entities.person).slice(0, 10) as Array<Person>;

  const zoomToTimeRange = useAppSelector(selectZoomToTimeRange);

  const parent = useRef<HTMLDivElement>(null);

  return (
    <div className={styles['timeline-wrapper']} ref={parent}>
      <TimelineSvg parentRef={parent} persons={persons} zoomToData={zoomToTimeRange} />
    </div>
  );
}
