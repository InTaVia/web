import { useRef } from 'react';

import { useAppSelector } from '@/app/store';
import { selectEntitiesByKind } from '@/features/common/entities.slice';
import styles from '@/features/timeline/timeline.module.css';
import { selectZoomToTimeRange } from '@/features/timeline/timeline.slice';
import { TimelineSvg } from '@/features/timeline/timeline-svg';

export function Timeline(): JSX.Element {
  const entities = useAppSelector(selectEntitiesByKind);
  const persons = Object.values(entities.person).slice(0, 10);

  const zoomToTimeRange = useAppSelector(selectZoomToTimeRange);

  const parent = useRef<HTMLDivElement>(null);

  return (
    <div className={styles['timeline-wrapper']} ref={parent}>
      <TimelineSvg
        parentRef={parent}
        persons={persons}
        zoomToData={zoomToTimeRange}
        renderLabel={true}
      />
    </div>
  );
}
