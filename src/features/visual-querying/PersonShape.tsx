import { useState } from 'react';

import { useAppSelector } from '@/features/common/store';
import { ConstraintList } from '@/features/visual-querying/ConstraintList';
import { DateConstraintView } from '@/features/visual-querying/DateConstraintView';
import { RingConstraint } from '@/features/visual-querying/RingConstraint';
import { TextConstraintView } from '@/features/visual-querying/TextConstraintView';
import type {
  DateConstraint,
  TextConstraint,
} from '@/features/visual-querying/visualQuerying.slice';
import { ConstraintType, selectConstraints } from '@/features/visual-querying/visualQuerying.slice';

export function PersonShape(): JSX.Element {
  const constraints = useAppSelector(selectConstraints);

  const [isConstListShown, setIsConstListShown] = useState(false);

  function handleClick() {
    setIsConstListShown(!isConstListShown);
  }

  const ringDims = constraints.map((constraint, idx, arr) => {
    const delta = 360 / arr.length;
    const padding = 0;
    const startAngle = idx * delta;
    const endAngle = (idx + 1) * delta - padding;

    return { delta, padding, idx, constraint, startAngle, endAngle };
  });

  return (
    <g>
      <circle r="100" fill="lightGray" style={{ cursor: 'pointer' }} onClick={handleClick} />
      <text
        x="0"
        y="0"
        fontSize="xxx-large"
        textAnchor="middle"
        dominantBaseline="central"
        fill="black"
        style={{ cursor: 'pointer' }}
        onClick={handleClick}
      >
        +
      </text>

      {ringDims.map(({ startAngle, endAngle, constraint }, idx) => {
        let valueDescription: string | null = null;
        switch (constraint.type) {
          case ConstraintType.Name:
            valueDescription = (constraint as TextConstraint).text;
            break;
          case ConstraintType.DateOfBirth:
          case ConstraintType.DateOfDeath:
            // eslint-disable-next-line no-case-declarations
            const dateRange = (constraint as DateConstraint).dateRange;
            valueDescription = dateRange ? dateRange.toString() : null;
            break;
          default:
            valueDescription = null;
            break;
        }

        return (
          <RingConstraint
            key={idx}
            idx={idx}
            innerRadius={100}
            startAngle={startAngle}
            endAngle={endAngle}
            outerRadius={130}
            type={constraint.type}
            valueDescription={valueDescription}
          />
        );
      })}
      {ringDims
        .filter(({ constraint }) => {
          return constraint.opened;
        })
        .map(({ constraint, startAngle }, idx) => {
          const x = Math.cos((startAngle / 180) * Math.PI) * 200;
          const y = Math.sin((startAngle / 180) * Math.PI) * 200;

          switch (constraint.type) {
            case ConstraintType.DateOfBirth:
            case ConstraintType.DateOfDeath:
              return (
                <DateConstraintView
                  key={idx}
                  idx={idx}
                  constraint={constraint as DateConstraint}
                  x={x}
                  y={y}
                  width={500}
                  height={250}
                />
              );
            case ConstraintType.Name:
              return (
                <TextConstraintView
                  key={idx}
                  idx={idx}
                  constraint={constraint as TextConstraint}
                  x={x}
                  y={y}
                  width={300}
                  height={80}
                />
              );
            // case ConstraintType.Place:
            //   return (
            //     <PlaceConstraintView
            //       key={idx}
            //       idx={idx}
            //       constraint={constraint as PlaceConstraint}
            //       x={x}
            //       y={y}
            //       width={550}
            //       height={350}
            //     />
            //   );
            default:
              return (
                <text x={x} y={y} fill="red">
                  Unknown constraint type: {constraint.type}
                </text>
              );
          }
        })}

      {isConstListShown && (
        <ConstraintList setIsConstListShown={setIsConstListShown} width={200} height={200} />
      )}
    </g>
  );
}