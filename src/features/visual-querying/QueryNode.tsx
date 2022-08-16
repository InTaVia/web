import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { useState } from 'react';

import { InnerRingSegment } from '@/features/visual-querying/InnerRingSegment';
import type { Origin } from '@/features/visual-querying/Origin';
import { ConstraintType } from '@/features/visual-querying/visualQuerying.slice';

interface QueryNodeProps {
  origin: Origin;
}

export function QueryNode(props: QueryNodeProps): JSX.Element {
  const { origin } = props;

  const circleRadius = 100;
  const innerRingWidth = 40;
  const iconSize = 2 * circleRadius * (2 / 3);

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
      <circle
        cx={origin.x(0)}
        cy={origin.y(0)}
        r={circleRadius}
        fill="#EDEDED"
        onClick={handleClick}
      />
      <PersonOutlineOutlinedIcon
        width={iconSize}
        height={iconSize}
        x={origin.x(0) - iconSize / 2}
        y={origin.y(0) - iconSize / 2}
        htmlColor="#A1A1A1"
      />

      {ringDims.map(({ startAngle, endAngle, constraintType }, idx) => {
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
            type={constraintType}
            label={ConstraintType[constraintType]}
            origin={origin.clone()}
          />
        );
      })}
    </g>
  );
}
