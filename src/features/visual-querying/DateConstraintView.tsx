import { Histogram } from '@/features/visual-querying/Histogram';
import type { DateConstraint } from '@/features/visual-querying/visualQuerying.slice';

import { useGetPersonDistributionByPropertyQuery } from '../common/intavia-api.service';

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
          <Histogram brushedArea={null} data={data!} dimensions={dimensions} />
        </g>
      )}
    </g>
  );
}
