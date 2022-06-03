import { useRef } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store';
import { selectEntitiesByKind } from '@/features/common/entities.slice';
import styles from '@/features/professions/professions.module.css';
import { LeafSizing, ProfessionsSvg } from '@/features/professions/professions-svg';
import type { Origin } from '@/features/visual-querying/Origin';
import type {
  Profession,
  ProfessionConstraint,
} from '@/features/visual-querying/visualQuerying.slice';
import { updateProfessions } from '@/features/visual-querying/visualQuerying.slice';

interface ProfessionsProps {
  origin: Origin;
  constraint?: ProfessionConstraint;
}

export type ToggleProfessionFn = (professions: Array<Profession>) => void;

export function Professions({ constraint, origin }: ProfessionsProps): JSX.Element {
  const dispatch = useAppDispatch();

  const entities = useAppSelector(selectEntitiesByKind);
  const persons = Object.values(entities.person).slice(0 /*10*/); // XXX

  const parent = useRef<HTMLDivElement>(null);

  function toggleProfession(professions: Parameters<ToggleProfessionFn>[0]) {
    if (!constraint) return;
    const numContained = professions
      .map((d) => {
        return constraint.selection?.includes(d);
      })
      .filter((d) => {
        return d;
      }).length;
    const totalNumber = professions.length;
    const mostOn = numContained >= totalNumber / 2;

    const newSelection = new Set<typeof professions[0]>(constraint.selection ?? []);
    if (mostOn) {
      // remove contained
      professions.forEach((v) => {
        return newSelection.delete(v);
      });
    } else {
      // add contained
      professions.forEach((v) => {
        return newSelection.add(v);
      });
    }

    dispatch(updateProfessions({ id: constraint.id, selection: Array.from(newSelection) }));
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
        origin={origin}
      />
    </div>
  );
}
