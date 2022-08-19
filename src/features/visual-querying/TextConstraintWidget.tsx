import type { ChangeEvent, FormEvent } from 'react';
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

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    dispatch(
      updateConstraintValue({
        id: constraint.id,
        value: text,
      }),
    );

    dispatch(toggleConstraintWidget(constraint.id));

    event.preventDefault();
  }

  return (
    <form onSubmit={onSubmit} className="flex justify-center gap-2 p-2">
      <TextField
        placeholder="Please enter a name"
        value={text}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          return setText(e.target.value);
        }}
        autoFocus={true}
      />
      <Button round="round" color="accent" disabled={text === ''}>
        Add
      </Button>
    </form>
  );
}
