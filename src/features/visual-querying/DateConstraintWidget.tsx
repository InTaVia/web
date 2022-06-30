import { Paper, Typography } from '@mui/material';

import { useAppDispatch } from '@/app/store';
import { useGetPersonDistributionByPropertyQuery } from '@/features/common/intavia-api.service';
import { Histogram } from '@/features/visual-querying/Histogram';
import { Origin } from '@/features/visual-querying/Origin';
import type { DateConstraint } from '@/features/visual-querying/visualQuerying.slice';
import { updateConstraintValue } from '@/features/visual-querying/visualQuerying.slice';

interface DateConstraintWidgetProps {
  idx: number;
  x: number;
  y: number;
  width: number;
  height: number;
  constraint: DateConstraint;
  origin: Origin;
}

export function DateConstraintWidget(props: DateConstraintWidgetProps): JSX.Element {
  const { x, y, width, height, constraint } = props;
  const dispatch = useAppDispatch();

  const { data, isLoading } = useGetPersonDistributionByPropertyQuery({
    property: constraint.id,
  });

  const dimensions = {
    x: x,
    y: y,
    marginTop: height - 32,
    marginLeft: 50,
    width: width,
    height: height,
    boundedWidth: width - 50,
    boundedHeight: height - 100,
  };

  function setBrushedArea(area: Array<number>) {
    dispatch(
      updateConstraintValue({
        id: constraint.id,
        value: area,
      }),
    );
  }

  // this is inside the foreignObject: completely new coordinate system
  const histogramOrigin = new Origin(dimensions.marginLeft, dimensions.marginTop);

  return (
    <foreignObject width={dimensions.width} height={dimensions.height} x={x} y={y}>
      <Paper
        elevation={3}
        sx={{
          margin: '2px',
          width: dimensions.width - 4,
          height: dimensions.height - 4,
        }}
      >
        {isLoading ? (
          <Typography>Loading ...</Typography>
        ) : (
          <svg width="100%" height="100%">
            <g className="data">
              <Histogram
                brushedArea={constraint.value}
                setBrushedArea={setBrushedArea}
                data={data!}
                dimensions={dimensions}
                origin={histogramOrigin}
              />
            </g>
          </svg>
        )}
      </Paper>
    </foreignObject>
  );
}
