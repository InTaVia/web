import { TextField } from '@mui/material';
import { useState } from 'react';

import { useAppDispatch } from '@/app/store';
import Button from '@/features/ui/Button';
import type { TextConstraint } from '@/features/visual-querying/visualQuerying.slice';
import { updateConstraintValue } from '@/features/visual-querying/visualQuerying.slice';

interface TextConstraintWidgetProps {
  width: number;
  height: number;
  constraint: TextConstraint;
}

export function TextConstraintWidget(props: TextConstraintWidgetProps): JSX.Element {
  const { width, height, constraint } = props;

  const dispatch = useAppDispatch();

  const [text, setText] = useState(constraint.value);

  function handleClick() {
    dispatch(
      updateConstraintValue({
        id: constraint.id,
        value: text,
      }),
    );
  }

  return (
    <div style={{ width: width, height: height }} className="p-3">
      <TextField
        label={constraint.type}
        variant="standard"
        value={text}
        onChange={(evt) => {
          return setText(evt.target.value);
        }}
      />
      <Button onClick={handleClick}>Add</Button>
    </div>
  );
}
