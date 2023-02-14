import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

import { constraintKindIds } from '@/features/visual-querying/constraints.types';
import { InnerRingSegment } from '@/features/visual-querying/InnerRingSegment';
import type { Origin } from '@/features/visual-querying/Origin';

interface QueryNodeProps {
  origin: Origin;
  selectedConstraint: string | null;
  setSelectedConstraint: (constraintId: string | null) => void;
}

export function QueryNode(props: QueryNodeProps): JSX.Element {
  const { origin, selectedConstraint, setSelectedConstraint } = props;

  const circleRadius = 100;
  const innerRingWidth = 40;
  const iconSize = 2 * circleRadius * (2 / 3);

  const ringDims = constraintKindIds.map((kind, idx, arr) => {
    const delta = 360 / arr.length;
    const padding = 0;
    const startAngle = idx * delta;
    const endAngle = (idx + 1) * delta - padding;
    const constraintKindId = kind;

    return { delta, padding, idx, constraintKindId, startAngle, endAngle };
  });

  return (
    <g>
      <circle cx={origin.x(0)} cy={origin.y(0)} r={circleRadius} fill="#EDEDED" />
      <PersonOutlineOutlinedIcon
        width={iconSize}
        height={iconSize}
        x={origin.x(0) - iconSize / 2}
        y={origin.y(0) - iconSize / 2}
        htmlColor="#A1A1A1"
      />

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
