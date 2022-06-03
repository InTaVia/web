import { Paper } from '@mui/material';

import { Professions } from '@/features/professions/professions';
import { Origin } from '@/features/visual-querying/Origin';
import type { ProfessionConstraint } from '@/features/visual-querying/visualQuerying.slice';

interface ProfessionConstraintProps {
  idx: number;
  x: number;
  y: number;
  width: number;
  height: number;
  constraint: ProfessionConstraint;
  origin: Origin;
}

export function ProfessionConstraintView(props: ProfessionConstraintProps): JSX.Element {
  const { x, y, width, height, constraint } = props;

  // this is inside the foreignObject: completely new coordinate system
  const origin = new Origin();

  return (
    <foreignObject x={x} y={y} width={width} height={height}>
      <Paper
        elevation={3}
        sx={{
          margin: '2px',
          width: width - 4,
          height: height - 4,
          display: 'grid',
        }}
      >
        <Professions constraint={constraint} origin={origin} />
      </Paper>
    </foreignObject>
  );
}
