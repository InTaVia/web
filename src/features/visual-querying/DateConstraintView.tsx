import { Histogram } from '@/features/visual-querying/Histogram';
import type { DateConstraint } from '@/features/visual-querying/visualQuerying.slice';
import { updateDateRange } from '@/features/visual-querying/visualQuerying.slice';

import { useGetPersonDistributionByPropertyQuery } from '../common/intavia-api.service';
import { useAppDispatch } from '../common/store';

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
      <rect
        fill="white"
        stroke="blue"
        strokeWidth={1}
        x="0"
        y="0"
        width={dimensions.width}
        height={dimensions.height}
      />

      {isLoading ? (
        <text>Loading ...</text>
      ) : (
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
      )}
    </g>
  );
}
