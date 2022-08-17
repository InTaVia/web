import type { ChangeEvent, KeyboardEvent } from 'react';
import { useState } from 'react';

import { useAppDispatch } from '@/app/store';
import Button from '@/features/ui/Button';
import TextField from '@/features/ui/TextField';
import type { TextConstraint } from '@/features/visual-querying/visualQuerying.slice';
import {
  toggleConstraintWidget,
  updateConstraintValue,
} from '@/features/visual-querying/visualQuerying.slice';

interface TextConstraintWidgetProps {
  constraint: TextConstraint;
}

export function TextConstraintWidget(props: TextConstraintWidgetProps): JSX.Element {
  const { constraint } = props;

  const dispatch = useAppDispatch();

  const [text, setText] = useState(constraint.value);

  function updateConstraint() {
    dispatch(
      updateConstraintValue({
        id: constraint.id,
        value: text,
      }),
    );

    dispatch(toggleConstraintWidget(constraint.id));
  }

  function handleKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case 'Enter':
        updateConstraint();
        break;
      default:
        break;
    }
  }

  return (
    <div className="flex justify-center gap-2 p-2">
      <TextField
        placeholder="Please enter a name"
        value={text}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          return setText(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        autoFocus={true}
      />
      <Button round="round" color="accent" disabled={text === ''} onClick={updateConstraint}>
        Add
      </Button>
    </div>
  );
}
