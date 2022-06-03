import { useState } from 'react';

import { useAppSelector } from '@/app/store';
import { ConstraintList } from '@/features/visual-querying/ConstraintList';
import { DateConstraintView } from '@/features/visual-querying/DateConstraintView';
import type { Origin } from '@/features/visual-querying/Origin';
import { ProfessionConstraintView } from '@/features/visual-querying/ProfessionConstraintView';
import { RingConstraint } from '@/features/visual-querying/RingConstraint';
import { TextConstraintView } from '@/features/visual-querying/TextConstraintView';
import type {
  DateConstraint,
  Profession,
  ProfessionConstraint,
  TextConstraint,
} from '@/features/visual-querying/visualQuerying.slice';
import { ConstraintType, selectConstraints } from '@/features/visual-querying/visualQuerying.slice';

interface PersonShapeProps {
  origin: Origin;
}

export function PersonShape(props: PersonShapeProps): JSX.Element {
  const constraints = useAppSelector(selectConstraints);
  const { origin } = props;

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
      <circle
        cx={origin.x(0)}
        cy={origin.y(0)}
        r="100"
        fill="lightGray"
        style={{ cursor: 'pointer' }}
        onClick={handleClick}
      />
      <text
        x={origin.x(0)}
        y={origin.y(0)}
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
          case ConstraintType.Profession: {
            // <-- lexical scope to appease esline no-case-declarations
            const selection = (constraint as ProfessionConstraint).selection;
            if (!selection) break; // empty

            if (selection.length <= 3) {
              valueDescription = selection.join(', ');
              break;
            }

            const [first, second, ...rest] = selection as Array<Profession>;
            valueDescription = `${first}, ${second}, ... (${rest.length} more)`;
            break;
          }
          default:
            console.warn(
              'No constraint ring description defined for constraint type:',
              constraint.type,
            );
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
            origin={origin.clone()}
          />
        );
      })}
      {ringDims
        .filter(({ constraint }) => {
          return constraint.opened;
        })
        .map(({ constraint, startAngle }, idx) => {
          const x = origin.x(Math.cos((startAngle / 180) * Math.PI) * 200);
          const y = origin.y(Math.sin((startAngle / 180) * Math.PI) * 200);

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
                  origin={origin.clone()}
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
                  origin={origin.clone()}
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
            case ConstraintType.Profession:
              return (
                <ProfessionConstraintView
                  key={idx}
                  idx={idx}
                  constraint={constraint as ProfessionConstraint}
                  x={x}
                  y={y}
                  width={300}
                  height={400}
                  origin={origin.clone()}
                />
              );
            default:
              return (
                <text x={x} y={y} fill="red">
                  Unknown constraint type: {constraint.type}
                </text>
              );
          }
        })}

      {isConstListShown && (
        <ConstraintList
          setIsConstListShown={setIsConstListShown}
          width={200}
          height={200}
          origin={origin.clone()}
        />
      )}
    </g>
  );
}
