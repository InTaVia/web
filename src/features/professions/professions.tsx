import { useRef } from 'react';

import { useAppSelector, useAppDispatch } from '@/app/store';
import { selectEntitiesByKind } from '@/features/common/entities.slice';
import styles from '@/features/professions/professions.module.css';
import { LeafSizing, ProfessionsSvg } from '@/features/professions/professions-svg';
import type { ProfessionConstraint } from '@/features/visual-querying/visualQuerying.slice';
import { updateProfessions } from '@/features/visual-querying/visualQuerying.slice';

interface ProfessionsProps {
  constraint?: ProfessionConstraint;
};

export type ToggleProfessionFn = (
  (
    profession: Iterable<Parameters<ProfessionConstraint['selection']['has']>[0]>,
    contained: boolean
  ) => void
);

export function Professions({ constraint }: ProfessionsProps): JSX.Element {
  const dispatch = useAppDispatch();

  const entities = useAppSelector(selectEntitiesByKind);
  const persons = Object.values(entities.person).slice(0 /*10*/); // XXX

  const parent = useRef<HTMLDivElement>(null);

  function toggleProfession(profession: Parameters<ToggleProfessionFn>[0], contained: Parameters<ToggleProfessionFn>[1]) {
    console.log('toggle', profession);
    // TODO
  }

  return (
    <div className={styles['professions-wrapper']} ref={parent}>
      <ProfessionsSvg
        parentRef={parent}
        persons={persons}
        renderLabel={true}
        leafSizing={LeafSizing.Qualitative}
        constraint={constraint}
        toggleProfession={toggleProfession}
      />
    </div>
  );
}
