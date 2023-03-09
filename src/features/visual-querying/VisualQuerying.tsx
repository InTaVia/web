import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@intavia/ui';
import { useRef, useState } from 'react';

import { useAppSelector } from '@/app/store';
import type { Constraint } from '@/features/visual-querying/constraints.types';
import { DateConstraintWidget } from '@/features/visual-querying/DateConstraintWidget';
import { ProfessionConstraintWidget } from '@/features/visual-querying/ProfessionConstraintWidget';
import { TextConstraintWidget } from '@/features/visual-querying/TextConstraintWidget';
import {
  selectConstraints,
  setConstraintValue,
} from '@/features/visual-querying/visualQuerying.slice';
import { VisualQueryingSvg } from '@/features/visual-querying/VisualQueryingSvg';
import { useResizeObserverDeprecated } from '@/lib/useResizeObserver';

export function VisualQuerying(): JSX.Element {
  const parent = useRef<HTMLDivElement>(null);
  const [width, height] = useResizeObserverDeprecated(parent);
  const constraints = useAppSelector(selectConstraints);

  const [selectedConstraint, setSelectedConstraint] = useState<string | null>(null);

  const selected = Object.values(constraints).find((constraint) => {
    return constraint.id === selectedConstraint;
  });

  return (
    <div className="absolute inset-0 grid h-full w-full overflow-hidden" ref={parent}>
      <VisualQueryingSvg
        parentWidth={width}
        parentHeight={height}
        selectedConstraint={selectedConstraint}
        setSelectedConstraint={setSelectedConstraint}
      />

      <ConstraintDialog constraint={selected} setSelectedConstraint={setSelectedConstraint} />
    </div>
  );
}

interface ConstraintDialogProps {
  constraint: Constraint | undefined;
  setSelectedConstraint: (id: string | null) => void;
}

function ConstraintDialog(props: ConstraintDialogProps): JSX.Element {
  const { constraint, setSelectedConstraint } = props;

  function onClose() {
    setSelectedConstraint(null);
  }

  function onClear() {}

  function onSubmit() {}

  return (
    <Dialog open={constraint != null} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit constraint</DialogTitle>
        </DialogHeader>

        <ConstraintDialogContent constraint={constraint} />

        <DialogFooter>
          <Button variant="destructive" onClick={onClear}>
            Clear
          </Button>
          <Button onClick={onSubmit}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ConstraintDialogContentProps {
  constraint: Constraint | undefined;
}

function ConstraintDialogContent(props: ConstraintDialogContentProps): JSX.Element | null {
  const { constraint } = props;

  if (constraint == null) return null;

  switch (constraint.kind.id) {
    case 'date-range':
      return <DateConstraintWidget constraint={constraint} />;
    case 'label':
      return <TextConstraintWidget constraint={constraint} />;
    // case 'geometry':
    //   return <PlaceConstraintWidget constraint={constraint} />;
    case 'vocabulary':
      return <ProfessionConstraintWidget constraint={constraint} />;
  }
}
