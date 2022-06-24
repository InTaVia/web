import { useState } from 'react';

import { useAppSelector } from '@/app/store';
import { DateConstraintWidget } from '@/features/visual-querying/DateConstraintWidget';
import { InnerRingSegment } from '@/features/visual-querying/InnerRingSegment';
import type { Origin } from '@/features/visual-querying/Origin';
import { PlaceConstraintWidget } from '@/features/visual-querying/PlaceConstraintWidget';
import { ProfessionConstraintWidget } from '@/features/visual-querying/ProfessionConstraintWidget';
import { TextConstraintWidget } from '@/features/visual-querying/TextConstraintView';
import type {
  DateConstraint,
  PlaceConstraint,
  ProfessionConstraint,
  TextConstraint,
} from '@/features/visual-querying/visualQuerying.slice';
import { ConstraintType, selectConstraints } from '@/features/visual-querying/visualQuerying.slice';

interface QueryNodeProps {
  origin: Origin;
}

export function QueryNode(props: QueryNodeProps): JSX.Element {
  const { origin } = props;

  const constraints = useAppSelector(selectConstraints);

  const [isConstListShown, setIsConstListShown] = useState(false);

  function handleClick() {
    setIsConstListShown(!isConstListShown);
  }

  const ringDims = Object.keys(ConstraintType).map((type, idx, arr) => {
    const delta = 360 / arr.length;
    const padding = 0;
    const startAngle = idx * delta;
    const endAngle = (idx + 1) * delta - padding;
    const constraintType = ConstraintType[type as keyof typeof ConstraintType];

    return { delta, padding, idx, constraintType, startAngle, endAngle };
  });

  return (
    <g>
      <circle cx={origin.x(0)} cy={origin.y(0)} r="100" fill="#EDEDED" onClick={handleClick} />
      <text
        x={origin.x(0)}
        y={origin.y(0)}
        fontSize="xxx-large"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#A1A1A1"
        onClick={handleClick}
      >
        +
      </text>

      {ringDims.map(({ startAngle, endAngle, constraintType }, idx) => {
        return (
          <InnerRingSegment
            key={idx}
            idx={idx}
            dims={{
              startAngle: startAngle,
              endAngle: endAngle,
              innerRadius: 100,
              outerRadius: 140,
            }}
            type={constraintType}
            label={ConstraintType[constraintType]}
            origin={origin.clone()}
          />
        );
      })}
      {constraints
        .filter((constraint) => {
          return constraint.opened;
        })
        .map((constraint, idx) => {
          const x = origin.x(250);
          const y = origin.y(0);

          switch (constraint.type) {
            case ConstraintType.Dates:
              return (
                <DateConstraintWidget
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
                <TextConstraintWidget
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
            case ConstraintType.Places:
              return (
                <PlaceConstraintWidget
                  key={idx}
                  idx={idx}
                  constraint={constraint as PlaceConstraint}
                  x={x}
                  y={y}
                  width={550}
                  height={350}
                />
              );
            case ConstraintType.Profession:
              return (
                <ProfessionConstraintWidget
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
                <text key={idx} x={x} y={y} fill="red">
                  Unknown constraint type: {constraint.type}
                </text>
              );
          }
        })}
    </g>
  );
}
