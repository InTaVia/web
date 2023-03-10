import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@intavia/ui';
import type { ReactNode } from 'react';
import { useRef, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store';
import { useSearchEntities } from '@/components/search/use-search-entities';
import { useSearchEntitiesFilters } from '@/components/search/use-search-entities-filters';
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

  function onClose() {
    setSelectedConstraint(null);
  }

  return (
    <div className="absolute inset-0 grid h-full w-full overflow-hidden" ref={parent}>
      <VisualQueryingSvg
        parentWidth={width}
        parentHeight={height}
        selectedConstraint={selectedConstraint}
        setSelectedConstraint={setSelectedConstraint}
      />

      <ConstraintDialog constraint={selected} onClose={onClose} />
    </div>
  );
}

interface ConstraintDialogProps {
  constraint: Constraint | undefined;
  onClose: () => void;
}

function ConstraintDialog(props: ConstraintDialogProps): JSX.Element {
  const { constraint, onClose } = props;

  return (
    <Dialog open={constraint != null} onOpenChange={onClose}>
      {/* TODO: should be inside a form. */}
      <ConstraintDialogContent constraint={constraint} onClose={onClose} />
    </Dialog>
  );
}

interface ConstraintDialogHeaderProps {
  children: ReactNode;
}

function ConstraintDialogHeader(props: ConstraintDialogHeaderProps): JSX.Element {
  const { children } = props;

  return (
    <DialogHeader>
      <DialogTitle>{children}</DialogTitle>
    </DialogHeader>
  );
}

interface ConstraintDialogFooterProps {
  onClear: () => void;
  onSubmit: () => void;
}

function ConstraintDialogFooter(props: ConstraintDialogFooterProps): JSX.Element {
  const { onClear, onSubmit } = props;

  return (
    <DialogFooter>
      <Button variant="destructive" onClick={onClear}>
        Clear
      </Button>
      <Button onClick={onSubmit}>Apply</Button>
    </DialogFooter>
  );
}

interface ConstraintDialogContentProps {
  constraint: Constraint | undefined;
  onClose: () => void;
}

function ConstraintDialogContent(props: ConstraintDialogContentProps): JSX.Element | null {
  const { constraint, onClose } = props;

  const searchFilters = useSearchEntitiesFilters();
  const { search } = useSearchEntities();

  const dispatch = useAppDispatch();
  const constraints = useAppSelector(selectConstraints);

  if (constraint == null) return null;

  switch (constraint.kind.id) {
    case 'date-range': {
      // eslint-disable-next-line no-inner-declarations
      function onClear() {
        dispatch(setConstraintValue({ ...constraint, value: null }));

        search({
          ...searchFilters,
          page: 1,
          born_after: undefined,
          born_before: undefined,
          died_after: undefined,
          died_before: undefined,
        });

        onClose();
      }

      // eslint-disable-next-line no-inner-declarations
      function onSubmit() {
        const [bornAfter, bornBefore] = constraints['person-birth-date'].value?.map((d) => {
          return new Date(d).toISOString();
        }) ?? [undefined, undefined];
        const [diedAfter, diedBefore] = constraints['person-death-date'].value?.map((d) => {
          return new Date(d).toISOString();
        }) ?? [undefined, undefined];

        search({
          ...searchFilters,
          page: 1,
          born_after: bornAfter,
          born_before: bornBefore,
          died_after: diedAfter,
          died_before: diedBefore,
        });

        onClose();
      }

      return (
        <DialogContent>
          <ConstraintDialogHeader>Add date constraint</ConstraintDialogHeader>
          <DateConstraintWidget constraint={constraint as any} />
          <ConstraintDialogFooter onClear={onClear} onSubmit={onSubmit} />
        </DialogContent>
      );
    }

    case 'label': {
      // eslint-disable-next-line no-inner-declarations
      function onClear() {
        dispatch(setConstraintValue({ ...constraint, value: null }));

        search({ ...searchFilters, page: 1, q: undefined });

        onClose();
      }

      // eslint-disable-next-line no-inner-declarations
      function onSubmit() {
        const q = constraints['person-name'].value ?? undefined;

        search({ ...searchFilters, page: 1, q });

        onClose();
      }

      return (
        <DialogContent>
          <ConstraintDialogHeader>Add name constraint</ConstraintDialogHeader>
          <TextConstraintWidget constraint={constraint as any} />
          <ConstraintDialogFooter onClear={onClear} onSubmit={onSubmit} />
        </DialogContent>
      );
    }

    // case 'geometry': {
    //   return (
    //     <DialogContent>
    //       <ConstraintDialogHeader>Date</ConstraintDialogHeader>
    //       <PlaceConstraintWidget constraint={constraint} />
    //       <ConstraintDialogFooter onClear={onClear} onSubmit={onSubmit} />
    //     </DialogContent>
    //   );
    // }

    case 'vocabulary': {
      // eslint-disable-next-line no-inner-declarations
      function onClear() {
        dispatch(setConstraintValue({ ...constraint, value: null }));

        search({ ...searchFilters, page: 1, occupations_id: undefined });

        onClose();
      }

      // eslint-disable-next-line no-inner-declarations
      function onSubmit() {
        const occupations_id = constraints['person-occupation'].value ?? undefined;

        search({ ...searchFilters, page: 1, occupations_id });

        onClose();
      }

      return (
        <DialogContent>
          <ConstraintDialogHeader>Add occupation constraint</ConstraintDialogHeader>
          <ProfessionConstraintWidget constraint={constraint as any} />
          <ConstraintDialogFooter onClear={onClear} onSubmit={onSubmit} />
        </DialogContent>
      );
    }
  }
}
