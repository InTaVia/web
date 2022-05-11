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

  // Define textPath for label
  const textPath = path();
  textPath.moveTo(Math.cos(startAngle) * innerRadius, Math.sin(startAngle) * innerRadius);
  textPath.arc(0, 0, innerRadius, startAngle, endAngle, false);

  let fillColor = 'red';
  switch (type) {
    case ConstraintType.DateOfBirth:
      fillColor = 'lightGreen';
      break;
    case ConstraintType.DateOfDeath:
      fillColor = 'green';
      break;
    case ConstraintType.Name:
      fillColor = 'skyBlue';
      break;
    // case ConstraintType.Place:
    //   fillColor = 'red';
    //   break;
    default:
      fillColor = 'pink';
      break;
  }

  return (
    <g>
      <defs>
        <path d={textPath.toString()} id={`textPath-${props.idx}`} />
      </defs>

      <path
        d={p.toString()}
        fill={fillColor}
        style={{ cursor: 'pointer' }}
        onClick={toggleOpenConstraint}
      />

      <text dy={-9} pointerEvents="none">
        <textPath xlinkHref={`#textPath-${props.idx}`} textAnchor="middle" startOffset="50%">
          {props.type}
        </textPath>
      </text>
    </g>
  );
}
