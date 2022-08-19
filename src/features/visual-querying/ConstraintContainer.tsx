import { TrashIcon } from '@heroicons/react/outline';

import { useAppDispatch } from '@/app/store';
import Button from '@/features/ui/Button';
import { DateConstraintWidget } from '@/features/visual-querying/DateConstraintWidget';
import { PlaceConstraintWidget } from '@/features/visual-querying/PlaceConstraintWidget';
import { ProfessionConstraintWidget } from '@/features/visual-querying/ProfessionConstraintWidget';
import { TextConstraintWidget } from '@/features/visual-querying/TextConstraintWidget';
import type {
  Constraint,
  DateConstraint,
  PlaceConstraint,
  ProfessionConstraint,
  TextConstraint,
} from '@/features/visual-querying/visualQuerying.slice';
import {
  ConstraintType,
  removeConstraint,
  toggleConstraintWidget,
} from '@/features/visual-querying/visualQuerying.slice';

interface ConstraintContainerHeaderProps {
  constraint: Constraint;
}

interface ConstraintContainerProps {
  position: { x: number; y: number };
  constraint: Constraint;
}

function ConstraintContainerHeader(props: ConstraintContainerHeaderProps): JSX.Element {
  const dispatch = useAppDispatch();
  const { constraint } = props;

  function confirmDeleteConstraint() {
    const confirmation = confirm(`Do you want to delete the ${constraint.name} constraint?`);
    if (confirmation) {
      dispatch(removeConstraint(constraint));
      dispatch(toggleConstraintWidget(constraint.id));
    }
  }

  function renderTypeSpecificHeader(): JSX.Element {
    switch (constraint.type) {
      case ConstraintType.Dates:
        if (constraint.value !== null) {
          return (
            <>
              <p className="text-base text-intavia-brand-700">{constraint.value[0] as number}</p>
              <p className="text-base text-intavia-gray-700">-</p>
              <p className="text-base text-intavia-brand-700">{constraint.value[1] as number}</p>
            </>
          );
        }
        return <></>;
      default:
        return <></>;
    }
  }

  return (
    <div className="flex h-12 w-full flex-row items-center justify-between bg-intavia-gray-50">
      <div className="h-content justify-left flex flex-row items-center gap-2">
        <p className="ml-3 mr-4 text-lg">{constraint.name}</p>
        {renderTypeSpecificHeader()}
      </div>

      <Button
        round="circle"
        size="small"
        className="mr-3"
        color="warning"
        onClick={confirmDeleteConstraint}
        disabled={constraint.value === null || constraint.value === ''}
      >
        <TrashIcon className="h-5 w-5" />
      </Button>
    </div>
  );
}

export function ConstraintContainer(props: ConstraintContainerProps): JSX.Element {
  const { constraint, position } = props;

  function renderWidget(): JSX.Element {
    switch (constraint.type) {
      case ConstraintType.Dates:
        return (
          <DateConstraintWidget
            width={400}
            height={200}
            constraint={constraint as DateConstraint}
          />
        );
      case ConstraintType.Name:
        return <TextConstraintWidget constraint={constraint as TextConstraint} />;
      case ConstraintType.Places:
        return (
          <PlaceConstraintWidget
            width={550}
            height={350}
            constraint={constraint as PlaceConstraint}
          />
        );
      case ConstraintType.Profession:
        return (
          <ProfessionConstraintWidget
            width={300}
            height={400}
            constraint={constraint as ProfessionConstraint}
          />
        );
    }
  }

  return (
    <div
      className="absolute overflow-clip rounded-md border bg-white"
      style={{ left: position.x, top: position.y }}
    >
      <ConstraintContainerHeader constraint={constraint} />
      {renderWidget()}
    </div>
  );
}
