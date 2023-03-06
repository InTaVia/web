import { Button, Input } from '@intavia/ui';
import type { ChangeEvent } from 'react';
import { useState } from 'react';

import { useAppDispatch } from '@/app/store';
import type { PersonNameConstraint } from '@/features/visual-querying/constraints.types';
import { setConstraintValue } from '@/features/visual-querying/visualQuerying.slice';

interface TextConstraintWidgetProps {
  constraint: PersonNameConstraint;
  setSelectedConstraint: (constraintId: string | null) => void;
}

export function TextConstraintWidget(props: TextConstraintWidgetProps): JSX.Element {
  const { constraint, setSelectedConstraint } = props;

  const dispatch = useAppDispatch();

  const [text, setText] = useState(constraint.value);

  function onSubmit() {
    dispatch(setConstraintValue({ ...constraint, value: text }));

    setSelectedConstraint(null);
  }

  // FIXME: avoid form inside a form, should be in a dialog
  return (
    <div className="flex justify-center gap-2 p-2">
      <Input
        placeholder="Please enter a name"
        value={text ?? ''}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          return setText(e.target.value);
        }}
        autoFocus={true}
        onKeyDown={(event) => {
          if (event.key === 'Enter') onSubmit();
        }}
      />
      <Button disabled={text === ''} onClick={onSubmit}>
        Add
      </Button>
    </div>
  );
}
