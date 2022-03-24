import { path } from 'd3-path';

import { useAppDispatch } from '@/features/common/store';
import { ConstraintType, toggleConstraint } from '@/features/visual-querying/visualQuerying.slice';

interface RingConstraintProps {
  idx: number;
  innerRadius: number;
  startAngle: number;
  endAngle: number;
  outerRadius: number;
  type: ConstraintType;
}

export function RingConstraint(props: RingConstraintProps): JSX.Element {
  const dispatch = useAppDispatch();

  const { innerRadius, outerRadius, type } = props;
  const startAngle = (props.startAngle * Math.PI) / 180;
  const endAngle = (props.endAngle * Math.PI) / 180;

  function toggleOpenConstraint() {
    dispatch(toggleConstraint(props.idx));
  }

  // Define path for ring element
  const p = path();
  p.moveTo(Math.cos(startAngle) * innerRadius, Math.sin(startAngle) * innerRadius);
  p.arc(0, 0, innerRadius, startAngle, endAngle, false);
  p.lineTo(Math.cos(endAngle) * outerRadius, Math.sin(endAngle) * outerRadius);
  p.arc(0, 0, outerRadius, endAngle, startAngle, true);
  p.closePath();

  let fillColor = 'red';
  switch (type) {
    case ConstraintType.Date:
      fillColor = 'red';
      break;
    case ConstraintType.Place:
      fillColor = 'green';
      break;
    default:
      fillColor = 'red';
      break;
  }

  return (
    <g>
      <path
        d={p.toString()}
        fill={fillColor}
        style={{ cursor: 'pointer' }}
        onClick={toggleOpenConstraint}
      />
    </g>
  );
}
