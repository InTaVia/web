import { TrashIcon } from '@heroicons/react/outline';
import { IconButton } from '@intavia/ui';
import { Fragment } from 'react';

import { useAppDispatch } from '@/app/store';
import type { Constraint } from '@/features/visual-querying/constraints.types';
import { setConstraintValue } from '@/features/visual-querying/visualQuerying.slice';

interface ConstraintContainerHeaderProps {
  constraint: Constraint;
  setSelectedConstraint: (constraintId: string | null) => void;
}

function ConstraintContainerHeader(props: ConstraintContainerHeaderProps): JSX.Element {
  const { constraint, setSelectedConstraint } = props;

  const dispatch = useAppDispatch();

  function confirmDeleteConstraint() {
    const confirmation = confirm(`Do you want to delete the ${constraint.id} constraint?`);
    if (confirmation) {
      dispatch(setConstraintValue({ ...constraint, value: null }));
      setSelectedConstraint(null);
    }
  }

  function renderTypeSpecificHeader(): JSX.Element {
    switch (constraint.kind.id) {
      case 'date-range':
        if (constraint.value !== null) {
          return (
            <Fragment>
              <p className="text-base text-intavia-brand-700">
                {new Date(constraint.value[0]).getFullYear()}
              </p>
              <p className="text-base text-intavia-neutral-700">-</p>
              <p className="text-base text-intavia-brand-700">
                {new Date(constraint.value[1]).getFullYear()}
              </p>
            </Fragment>
          );
        }
        return <></>;
      default:
        return <></>;
    }
  }

  return (
    <div className="flex h-12 w-full flex-row items-center justify-between bg-intavia-neutral-50">
      <div className="flex h-min flex-row items-center justify-start gap-2">
        <p className="ml-3 mr-4 text-lg">{constraint.label.default}</p>
        {renderTypeSpecificHeader()}
      </div>

      <IconButton
        size="sm"
        className="mr-3"
        variant="destructive"
        onClick={confirmDeleteConstraint}
        disabled={constraint.value === null || constraint.value === ''}
        label="Clear constraint"
      >
        <TrashIcon className="h-5 w-5" />
      </IconButton>
    </div>
  );
}
