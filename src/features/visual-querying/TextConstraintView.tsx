import type { ChangeEvent } from 'react';
import { useState } from 'react';

import { useAppDispatch } from '@/app/store';
import Button from '@/features/ui/Button';
import TextField from '@/features/ui/TextField';
import type { TextConstraint } from '@/features/visual-querying/visualQuerying.slice';
import { updateConstraintValue } from '@/features/visual-querying/visualQuerying.slice';

interface TextConstraintWidgetProps {
  constraint: TextConstraint;
}

export function TextConstraintWidget(props: TextConstraintWidgetProps): JSX.Element {
  const { constraint } = props;

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
    <div className="flex justify-center gap-2 p-2">
      <TextField
        placeholder="Please enter a name"
        value={text}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          return setText(e.target.value);
        }}
      />
      <Button round="round" color="accent" disabled={text === ''} onClick={handleClick}>
        Add
      </Button>
    </div>
  );
}
