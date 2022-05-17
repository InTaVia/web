import { Button } from '@mui/material';
import type { MouseEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

import { useLazyGetPersonsQuery } from '@/features/common/intavia-api.service';
import { useAppDispatch, useAppSelector } from '@/features/common/store';
import { PersonShape } from '@/features/visual-querying/PersonShape';
import type {
  DateConstraint,
  TextConstraint,
} from '@/features/visual-querying/visualQuerying.slice';
import {
  ConstraintType,
  selectConstraints,
  toggleConstraint,
} from '@/features/visual-querying/visualQuerying.slice';

export function VisualQuerying(): JSX.Element {
  const dispatch = useAppDispatch();
  const constraints = useAppSelector(selectConstraints);
  const [svgViewBox, setSvgViewBox] = useState('0 0 0 0');
  const svgRef = useRef<SVGSVGElement>(null);

  const [trigger] = useLazyGetPersonsQuery();

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
    void trigger(
      {
        q: name ?? undefined,
        dateOfBirthStart: dateOfBirth ? dateOfBirth[0] : undefined,
        dateOfBirthEnd: dateOfBirth ? dateOfBirth[1] : undefined,
        dateOfDeathStart: dateOfDeath ? dateOfDeath[0] : undefined,
        dateOfDeathEnd: dateOfDeath ? dateOfDeath[1] : undefined,
      },
      true,
    );
  }

  function dismissConstraintViews(e: MouseEvent<SVGSVGElement>) {
    if (e.target === svgRef.current) {
      constraints.forEach((constraint, idx) => {
        if (constraint.opened) {
          dispatch(toggleConstraint(idx));
        }
      });
    }
  }

  return (
    <div className="visual-querying-wrapper">
      <Button variant="contained" onClick={sendQuery}>
        Search
      </Button>
      <svg
        width="100%"
        height="100%"
        viewBox={svgViewBox}
        onClick={dismissConstraintViews}
        ref={svgRef}
      >
        <PersonShape />
      </svg>
    </div>
  );
}
