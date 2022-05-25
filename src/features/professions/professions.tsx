import { useRef } from 'react';

import { useAppSelector } from '@/app/store';
import { selectEntitiesByKind } from '@/features/common/entities.slice';
import styles from '@/features/professions/professions.module.css';
import { ProfessionsSvg } from '@/features/professions/professions-svg';

export function Professions(): JSX.Element {
  const entities = useAppSelector(selectEntitiesByKind);
  const persons = Object.values(entities.person).slice(0 /*10*/); // XXX

  const parent = useRef<HTMLDivElement>(null);

  return (
    <div className={styles['professions-wrapper']} ref={parent}>
      <ProfessionsSvg parentRef={parent} persons={persons} renderLabel={true} />
    </div>
  );
}
