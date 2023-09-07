import type { EntityKind } from '@intavia/api-client';
import { useState } from 'react';

import { useAppSelector } from '@/app/store';
import { IntaviaIcon } from '@/features/common/icons/intavia-icon';
import { ringConstraintKindIds } from '@/features/visual-querying/constraints.types';
import { InnerRingSegment } from '@/features/visual-querying/InnerRingSegment';
import type { Origin } from '@/features/visual-querying/Origin';
import { selectConstraintById } from '@/features/visual-querying/visualQuerying.slice';

interface QueryNodeProps {
  origin: Origin;
  selectedConstraint: string | null;
  setSelectedConstraint: (constraintId: string | null) => void;
}

export function QueryNode(props: QueryNodeProps): JSX.Element {
  const { origin, selectedConstraint, setSelectedConstraint } = props;

  const [isCenterHovered, setCenterHovered] = useState(false);

  const selectedEntityKind = useAppSelector((state) => {
    return selectConstraintById(state, 'entity-kind');
  }).value as EntityKind | null;

  const circleRadius = 100;
  const innerRingWidth = 40;
  const iconSize = (2 * circleRadius * 2) / 3;

  const ringDims = ringConstraintKindIds.map((kind, idx, arr) => {
    const delta = 360 / arr.length;
    const padding = 0;
    const startAngle = idx * delta;
    const endAngle = (idx + 1) * delta - padding;
    const constraintKindId = kind;

    return { delta, padding, idx, constraintKindId, startAngle, endAngle };
  });

  return (
    <g>
      <g
        className="cursor-pointer"
        onMouseEnter={() => {
          setCenterHovered(true);
        }}
        onMouseLeave={() => {
          setCenterHovered(false);
        }}
        onClick={(event) => {
          setSelectedConstraint('entity-kind');
          event.stopPropagation();
        }}
      >
        <circle
          cx={origin.x(0)}
          cy={origin.y(0)}
          r={circleRadius}
          fill={isCenterHovered ? '#E7E7E7' : 'white'}
        />
        <title>Click to constraint entity type</title>
        <foreignObject
          width={iconSize}
          height={iconSize}
          x={origin.x(0) - iconSize / 2}
          y={origin.y(0) - iconSize / 2}
        >
          <IntaviaIcon
            icon={selectedEntityKind ? selectedEntityKind : 'collection'}
            // eslint-disable-next-line tailwindcss/no-custom-classname
            className={`w-[${iconSize}px] h-[${iconSize}px]`}
            stroke={isCenterHovered ? '#656565' : '#A1A1A1'}
            strokeWidth={1.2}
            fill="none"
          />
        </foreignObject>
      </g>

      {ringDims.map(({ startAngle, endAngle, constraintKindId }, idx) => {
        return (
          <InnerRingSegment
            key={idx}
            idx={idx}
            dims={{
              startAngle: startAngle,
              endAngle: endAngle,
              innerRadius: circleRadius,
              outerRadius: circleRadius + innerRingWidth,
            }}
            kind={constraintKindId}
            origin={origin.clone()}
            selectedConstraint={selectedConstraint}
            setSelectedConstraint={setSelectedConstraint}
          />
        );
      })}
    </g>
  );
}
