import { Typography } from '@mui/material';

import { useAppDispatch } from '@/app/store';
import { useGetPersonDistributionByPropertyQuery } from '@/features/common/intavia-api.service';
import { Histogram } from '@/features/visual-querying/Histogram';
import { Origin } from '@/features/visual-querying/Origin';
import type { DateConstraint } from '@/features/visual-querying/visualQuerying.slice';
import { updateConstraintValue } from '@/features/visual-querying/visualQuerying.slice';

interface DateConstraintWidgetProps {
  width: number;
  height: number;
  constraint: DateConstraint;
}

export function DateConstraintWidget(props: DateConstraintWidgetProps): JSX.Element {
  const { width, height, constraint } = props;
  const dispatch = useAppDispatch();

  const { data, isLoading } = useGetPersonDistributionByPropertyQuery({
    property: constraint.id,
  });

  const dimensions = {
    x: 0,
    y: 0,
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

  function renderContent(): JSX.Element {
    if (isLoading) {
      return <Typography>Loading ...</Typography>;
    }

    if (data) {
      return (
        <svg width="100%" height="100%">
          <g className="data">
            <Histogram
              brushedArea={constraint.value}
              setBrushedArea={setBrushedArea}
              data={data}
              dimensions={dimensions}
              origin={histogramOrigin}
            />
          </g>
        </svg>
      );
    }

    return <Typography>No data</Typography>;
  }

  return (
    <div style={{ width: dimensions.width, height: dimensions.height }}>{renderContent()}</div>
  );
}
