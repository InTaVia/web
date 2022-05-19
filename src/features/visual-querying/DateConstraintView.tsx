import { Paper, Typography } from '@mui/material';

import { useAppDispatch } from '@/app/store';
import { useGetPersonDistributionByPropertyQuery } from '@/features/common/intavia-api.service';
import { Histogram } from '@/features/visual-querying/Histogram';
import type { DateConstraint } from '@/features/visual-querying/visualQuerying.slice';
import { updateDateRange } from '@/features/visual-querying/visualQuerying.slice';

interface DateConstraintProps {
  idx: number;
  x: number;
  y: number;
  width: number;
  height: number;
  constraint: DateConstraint;
}

export function DateConstraintView(props: DateConstraintProps): JSX.Element {
  const { x, y, width, height, constraint } = props;
  const dispatch = useAppDispatch();

  const { data, isLoading } = useGetPersonDistributionByPropertyQuery({
    property: constraint.type,
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
      updateDateRange({
        id: constraint.id,
        dateRange: area,
      }),
    );
  }

  return (
    <g transform={`translate(${x}, ${y})`}>
      <foreignObject width={dimensions.width} height={dimensions.height}>
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
              <g
                className="data"
                transform={`translate(${dimensions.marginLeft}, ${dimensions.marginTop})`}
              >
                <Histogram
                  brushedArea={constraint.dateRange}
                  setBrushedArea={setBrushedArea}
                  data={data!}
                  dimensions={dimensions}
                />
              </g>
            </svg>
          )}
        </Paper>
      </foreignObject>
    </g>
  );
}
