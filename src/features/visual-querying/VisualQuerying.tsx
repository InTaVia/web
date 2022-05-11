import { Button } from '@mui/material';
import { useEffect, useState } from 'react';

import { PersonShape } from '@/features/visual-querying/PersonShape';

import { useLazyGetPersonsByParamQuery } from '../common/intavia-api.service';
import { useAppSelector } from '../common/store';
import type { DateConstraint, TextConstraint } from './visualQuerying.slice';
import { ConstraintType, selectConstraints } from './visualQuerying.slice';

export function VisualQuerying(): JSX.Element {
  const [svgViewBox, setSvgViewBox] = useState('0 0 0 0');
  const constraints = useAppSelector(selectConstraints);

  const [trigger] = useLazyGetPersonsByParamQuery();

  useEffect(() => {
    const newSvgViewBox = `${-window.innerWidth / 2} ${-window.innerHeight / 2} ${
      window.innerWidth
    } ${window.innerHeight}`;
    setSvgViewBox(newSvgViewBox);
  }, []);

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

    // Send the query
    void trigger({
      name: name ?? undefined,
      dateOfBirthStart: dateOfBirth ? dateOfBirth[0] : undefined,
      dateOfBirthEnd: dateOfBirth ? dateOfBirth[1] : undefined,
      dateOfDeathStart: dateOfDeath ? dateOfDeath[0] : undefined,
      dateOfDeathEnd: dateOfDeath ? dateOfDeath[1] : undefined,
    });
  }

  return (
    <div className="visual-querying-wrapper">
      <svg width="100%" height="100%" viewBox={svgViewBox}>
        <PersonShape />
      </svg>
      <Button variant="contained" onClick={sendQuery}>
        Search
      </Button>
    </div>
  );
}
