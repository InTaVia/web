import { Button } from '@mui/material';
import { useRef } from 'react';

import { useAppSelector } from '@/app/store';
import { useLazyGetPersonsQuery } from '@/features/common/intavia-api.service';
import styles from '@/features/visual-querying/visual-querying.module.css';
import type {
  DateConstraint,
  ProfessionConstraint,
  TextConstraint,
} from '@/features/visual-querying/visualQuerying.slice';
import { ConstraintType, selectConstraints } from '@/features/visual-querying/visualQuerying.slice';
import { VisualQueryingSvg } from '@/features/visual-querying/VisualQueryingSvg';

export function VisualQuerying(): JSX.Element {
  const parent = useRef<HTMLDivElement>(null);

  const constraints = useAppSelector(selectConstraints);
  const [trigger] = useLazyGetPersonsQuery();

  function sendQuery() {
    // Get parameters from constraints
    const nameConstraint = constraints.find((constraint) => {
      return constraint.type === ConstraintType.Name;
    });
    const name = nameConstraint ? (nameConstraint as TextConstraint).text : null;

    const dateOfBirthConstraint = constraints.find((constraint) => {
      return constraint.type === ConstraintType.DateOfBirth;
    });
    const dateOfBirth = dateOfBirthConstraint
      ? (dateOfBirthConstraint as DateConstraint).dateRange
      : null;

    const dateOfDeathConstraint = constraints.find((constraint) => {
      return constraint.type === ConstraintType.DateOfDeath;
    });
    const dateOfDeath = dateOfDeathConstraint
      ? (dateOfDeathConstraint as DateConstraint).dateRange
      : null;

    const professionsConstraint = constraints.find((constraint) => {
      return constraint.type === ConstraintType.Profession;
    });
    const professions =
      (professionsConstraint as ProfessionConstraint | undefined)?.selection ?? undefined;

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

  return (
    <div className={styles['visual-querying-outer-wrapper']}>
      <Button variant="contained" onClick={sendQuery} className={styles['search-button']}>
        Search
      </Button>
      <div className={styles['visual-querying-inner-wrapper']} ref={parent}>
        <VisualQueryingSvg parentRef={parent} />
      </div>
    </div>
  );
}
