import { List, ListItemButton, Paper, Typography } from '@mui/material';
import type { MouseEvent } from 'react';

import { useAppDispatch, useAppSelector } from '@/features/common/store';
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
        opened: true,
        type: type,
        dateRange: null,
      } as Constraint),
    );
  }

  return (
    <foreignObject width={props.width} height={props.height}>
      <Paper>
        <List
          component="ul"
          role="list"
          sx={{ borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: '#eee' }}
        >
          {Object.values(ConstraintType).map((value) => {
            return (
              <ListItemButton key={value} sx={{ paddingBlock: 2 }} onClick={handleClick}>
                <Typography>{value}</Typography>
              </ListItemButton>
            );
          })}
        </List>
      </Paper>
    </foreignObject>
  );
}