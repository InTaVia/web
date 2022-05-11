/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import type { MouseEvent } from 'react';

import { useAppDispatch, useAppSelector } from '@/features/common/store';
import styles from '@/features/visual-querying/visual-querying.module.css';
import type { Constraint } from '@/features/visual-querying/visualQuerying.slice';
import {
  addConstraint,
  ConstraintType,
  selectConstraints,
} from '@/features/visual-querying/visualQuerying.slice';

interface ConstraintListProps {
  width: number;
  height: number;
  setIsConstListShown: (isShown: boolean) => void;
}

export function ConstraintList(props: ConstraintListProps) {
  const dispatch = useAppDispatch();
  const constraints = useAppSelector(selectConstraints);

  function handleClick(e: MouseEvent<HTMLElement>) {
    const type = e.currentTarget.innerText as ConstraintType;
    props.setIsConstListShown(false);

    if (
      constraints.filter((constraint) => {
        return constraint.type === type;
      }).length > 0
    ) {
      console.log(`Constraint ${type} already exists.`);
      return;
    }

    dispatch(
      addConstraint({
        id: type,
        opened: false,
        type: type,
        dateRange: null,
      } as Constraint),
    );
  }

  return (
    <foreignObject width={props.width} height={props.height}>
      <div className={styles['constraint-list-wrapper']}>
        <ul className={styles['constraint-list']}>
          {Object.values(ConstraintType).map((value) => {
            return (
              <li key={value} className={styles['constraint-list-elem']} onClick={handleClick}>
                {value}
              </li>
            );
          })}
        </ul>
      </div>
    </foreignObject>
  );
}
