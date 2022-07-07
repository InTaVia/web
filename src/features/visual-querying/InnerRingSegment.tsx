import { useState } from 'react';

import { useAppSelector } from '@/app/store';
import type { Origin } from '@/features/visual-querying/Origin';
import { OuterRingSegment } from '@/features/visual-querying/OuterRingSegment';
import type { RingDims } from '@/features/visual-querying/ringSegmentUtils';
import {
  getArcedTextPath,
  getRingSegmentColors,
  getRingSegmentPath,
} from '@/features/visual-querying/ringSegmentUtils';
import type { ConstraintType } from '@/features/visual-querying/visualQuerying.slice';
import { selectConstraints } from '@/features/visual-querying/visualQuerying.slice';

interface InnerRingSegmentProps {
  idx: number;
  dims: RingDims;
  type: ConstraintType;
  label: string;
  origin: Origin;
}

export function InnerRingSegment(props: InnerRingSegmentProps): JSX.Element {
  const { idx, dims, type, label, origin } = props;

  const [isHovered, setIsHovered] = useState(false);

  const outerRingWidth = 55;

  const constraints = useAppSelector(selectConstraints).filter((constraint) => {
    return constraint.type === type;
  });

  // Calculate dims of outer ring segments
  const outerRingDims = constraints.map((constraint, idx, arr) => {
    const delta = (dims.endAngle - dims.startAngle) / arr.length;
    const padding = 0;
    const startAngle = dims.startAngle + idx * delta;
    const endAngle = dims.startAngle + (idx + 1) * delta - padding;

    return { delta, padding, idx, startAngle, endAngle, constraint };
  });

  const path = getRingSegmentPath(origin, dims);
  const textPath = getArcedTextPath(origin, dims, 'center');
  const [fillColor, textColor] = getRingSegmentColors(type);

  function drawOuterRing() {
    let visibleOuterRingDims = outerRingDims;
    if (!isHovered) {
      // Only draw rings that have a value
      visibleOuterRingDims = visibleOuterRingDims.filter(({ constraint }) => {
        return (constraint.value !== null && constraint.value !== '') || constraint.opened;
      });
    }

    return visibleOuterRingDims.map(({ startAngle, endAngle, constraint }, idx) => {
      return (
        <OuterRingSegment
          key={idx}
          dims={{
            startAngle: startAngle,
            endAngle: endAngle,
            innerRadius: dims.outerRadius,
            outerRadius: dims.outerRadius + outerRingWidth,
          }}
          origin={origin}
          constraint={constraint}
        />
      );
    });
  }

  return (
    <g
      id={`ring-constraint-${idx}`}
      onMouseEnter={() => {
        return setIsHovered(true);
      }}
      onMouseLeave={() => {
        return setIsHovered(false);
      }}
    >
      {/* Inner Ring */}
      <defs>
        <path d={textPath.toString()} id={`textPath-${idx}`} />
      </defs>

      <g>
        <path d={path.toString()} fill={fillColor} style={{ cursor: 'pointer' }} />

        <text pointerEvents="none" fill={textColor} fontSize="17px">
          <textPath xlinkHref={`#textPath-${idx}`} textAnchor="middle" startOffset="50%">
            {label}
          </textPath>
        </text>
      </g>

      {/* Outer Ring */}
      {drawOuterRing()}
    </g>
  );
}
