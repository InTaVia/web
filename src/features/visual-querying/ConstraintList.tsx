/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import type { MouseEvent } from 'react';

import { useAppDispatch } from '@/features/common/store';
import styles from '@/features/visual-querying/visual-querying.module.css';
import type { Constraint } from '@/features/visual-querying/visualQuerying.slice';
import { addConstraint, ConstraintType } from '@/features/visual-querying/visualQuerying.slice';

interface ConstraintListProps {
  width: number;
  height: number;
  setIsConstListShown: (isShown: boolean) => void;
}

export function ConstraintList(props: ConstraintListProps) {
  const dispatch = useAppDispatch();

  function handleClick(e: MouseEvent<HTMLElement>) {
    const type = e.currentTarget.innerText as ConstraintType;
    props.setIsConstListShown(false);

    dispatch(
      addConstraint({
        id: type,
        opened: false,
        type: type,
        minDate: null,
        maxDate: null,
      } as Constraint),
    );
  }

  return (
    <foreignObject width={props.width} height={props.height}>
      <div className={styles['constraint-list-wrapper']}>
        <ul className={styles['constraint-list']}>
          {Object.keys(ConstraintType).map((key) => {
            return (
              <li key={key} className={styles['constraint-list-elem']} onClick={handleClick}>
                {key}
              </li>
            );
          })}
        </ul>
      </div>
    </foreignObject>
  );
}
