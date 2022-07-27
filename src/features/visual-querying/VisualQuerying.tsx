import { useRef } from 'react';

import { useAppSelector } from '@/app/store';
import { useLazyGetPersonsQuery } from '@/features/common/intavia-api.service';
import Button from '@/features/ui/Button';
import { ConstraintContainer } from '@/features/visual-querying/ConstraintContainer';
import styles from '@/features/visual-querying/visual-querying.module.css';
import type {
  DateConstraint,
  ProfessionConstraint,
  TextConstraint,
} from '@/features/visual-querying/visualQuerying.slice';
import { ConstraintType, selectConstraints } from '@/features/visual-querying/visualQuerying.slice';
import { VisualQueryingSvg } from '@/features/visual-querying/VisualQueryingSvg';
import { useResizeObserver } from '@/lib/useResizeObserver';

export function VisualQuerying(): JSX.Element {
  const parent = useRef<HTMLDivElement>(null);
  const [width, height] = useResizeObserver(parent);

  const constraints = useAppSelector(selectConstraints);
  const [trigger] = useLazyGetPersonsQuery();

  function sendQuery() {
    // Get parameters from constraints
    const nameConstraint = constraints.find((constraint) => {
      return constraint.type === ConstraintType.Name;
    });
    const name = nameConstraint ? (nameConstraint as TextConstraint).value : null;

    // TODO (samuelbeck): add date-lived-constraint
    const dateOfBirthConstraint = constraints.find((constraint) => {
      return (
        constraint.type === ConstraintType.Dates && constraint.id === 'date-of-birth-constraint'
      );
    });
    const dateOfBirth = dateOfBirthConstraint
      ? (dateOfBirthConstraint as DateConstraint).value
      : null;

    const dateOfDeathConstraint = constraints.find((constraint) => {
      return (
        constraint.type === ConstraintType.Dates && constraint.id === 'date-of-death-constraint'
      );
    });
    const dateOfDeath = dateOfDeathConstraint
      ? (dateOfDeathConstraint as DateConstraint).value
      : null;

    const professionsConstraint = constraints.find((constraint) => {
      return constraint.type === ConstraintType.Profession;
    });
    const professions =
      (professionsConstraint as ProfessionConstraint | undefined)?.value ?? undefined;

    // TODO (samuelbeck): add place constraints

    // Send the query
    void trigger(
      {
        q: name ?? undefined,
        dateOfBirthStart: dateOfBirth ? dateOfBirth[0] : undefined,
        dateOfBirthEnd: dateOfBirth ? dateOfBirth[1] : undefined,
        dateOfDeathStart: dateOfDeath ? dateOfDeath[0] : undefined,
        dateOfDeathEnd: dateOfDeath ? dateOfDeath[1] : undefined,
        professions: JSON.stringify(professions),
      },
      true,
    );
  }

  function isButtonDisabled(): boolean {
    return !constraints.some((constraint) => {
      return constraint.value !== null && constraint.value !== '';
    });
  }

  function getContainerPosition(type: ConstraintType): { x: number; y: number } {
    const center: [number, number] = [width / 2, height / 2];

    switch (type) {
      case ConstraintType.Dates:
        return { x: center[0] + 200, y: center[1] - 300 };
      case ConstraintType.Places:
        return { x: center[0] + 200, y: center[1] + 0 };
      case ConstraintType.Profession:
        return { x: center[0] - 550, y: center[1] + 0 };
      case ConstraintType.Name:
        return { x: center[0] - 550, y: center[1] - 150 };
      default:
        return { x: 0, y: 0 };
    }
  }

  return (
    <div id="vq-outer-wrapper" className={styles['visual-querying-outer-wrapper']}>
      <Button
        round="round"
        onClick={sendQuery}
        className="h-10 w-24 justify-self-center"
        color="accent"
        disabled={isButtonDisabled()}
      >
        Search
      </Button>
      <div
        id="vq-inner-wrapper"
        className="relative h-full w-full overflow-hidden vq-min:overflow-scroll"
        ref={parent}
      >
        <VisualQueryingSvg parentWidth={width} parentHeight={height} />

        {constraints
          .filter((constraint) => {
            return constraint.opened;
          })
          .map((constraint, idx) => {
            return (
              <ConstraintContainer
                key={idx}
                position={getContainerPosition(constraint.type)}
                constraint={constraint}
              />
            );
          })}
      </div>
    </div>
  );
}
