import { Input } from '@intavia/ui';
import type { ChangeEvent } from 'react';

import { useAppDispatch } from '@/app/store';
import type { PersonNameConstraint } from '@/features/visual-querying/constraints.types';
import { setConstraintValue } from '@/features/visual-querying/visualQuerying.slice';

interface TextConstraintWidgetProps {
  constraint: PersonNameConstraint;
}

export function TextConstraintWidget(props: TextConstraintWidgetProps): JSX.Element {
  const { constraint } = props;

  const dispatch = useAppDispatch();

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    dispatch(setConstraintValue({ ...constraint, value: event.currentTarget.value }));
  }

  return (
    <Input
      placeholder="Please enter a name"
      value={constraint.value ?? ''}
      onChange={onChange}
      autoFocus={true}
    />
  );
}
