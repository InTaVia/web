import { useRef } from 'react';

import { useAppDispatch } from '@/app/store';
import type { Profession as ProfessionEntity } from '@/features/common/entity.model';
import styles from '@/features/professions/professions.module.css';
import type { LeafSizing } from '@/features/professions/professions-svg';
import { ProfessionsSvg } from '@/features/professions/professions-svg';
import type { Origin } from '@/features/visual-querying/Origin';
import type {
  Profession,
  ProfessionConstraint,
} from '@/features/visual-querying/visualQuerying.slice';
import { updateProfessions } from '@/features/visual-querying/visualQuerying.slice';

interface ProfessionsProps {
  professions: Array<ProfessionEntity & { count: number }>;
  origin: Origin;
  leafSizing: LeafSizing;
  constraint?: ProfessionConstraint;
}

export type ToggleProfessionFn = (professions: Array<Profession>) => void;

export function Professions({
  constraint,
  leafSizing,
  origin,
  professions,
}: ProfessionsProps): JSX.Element {
  const dispatch = useAppDispatch();

  const parent = useRef<HTMLDivElement>(null);

  /**
   * Toggle professions on or off in the constraint. If the profession is a
   * subtree parent, only the leaves are toggled. Here, the inverse of the
   * majority value will be the new value for all nodes (i.e., if more than 50%
   * of nodes are deselected previously, all will be selected, and vice versa).
   */
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
        professions={professions}
        renderLabel={true}
        leafSizing={leafSizing}
        constraint={constraint}
        toggleProfession={toggleProfession}
        origin={origin}
      />
    </div>
  );
}
