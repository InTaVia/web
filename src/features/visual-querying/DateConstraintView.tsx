import type { ScaleTime } from 'd3-scale';
import { scaleLinear, scaleTime } from 'd3-scale';

import { Histogram } from '@/features/visual-querying/Histogram';
import type { DateConstraint } from '@/features/visual-querying/visualQuerying.slice';

interface DateConstraintProps {
  idx: number;
  x: number;
  y: number;
  width: number;
  height: number;
  constraint: DateConstraint;
}

const dummyData = [
  { date: new Date('0000-01-01'), value: 10 },
  { date: new Date('0010-01-01'), value: 14 },
  { date: new Date('0020-01-01'), value: 46 },
  { date: new Date('0030-01-01'), value: 1 },
  { date: new Date('0040-01-01'), value: 11 },
  { date: new Date('0050-01-01'), value: 82 },
  { date: new Date('0060-01-01'), value: 62 },
  { date: new Date('0070-01-01'), value: 100 },
  { date: new Date('0080-01-01'), value: 51 },
  { date: new Date('0090-01-01'), value: 74 },
];

export function DateConstraintView(props: DateConstraintProps): JSX.Element {
  const { x, y, width, height } = props;

  const dimensions = {
    marginTop: 100,
    marginLeft: 50,
    width: width,
    height: height,
    boundedWidth: width - 50,
    boundedHeight: height - 100,
  };

  const xScale: ScaleTime<number, number> = scaleTime()
    .domain([new Date('0000-01-01'), new Date('0100-01-01')])
    .range([0, width - 100]);

  const yScale = scaleLinear()
    .domain([0, 100])
    .range([0, 50 - height]);

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
      <g
        className="data"
        transform={`translate(${dimensions.marginLeft}, ${dimensions.marginTop})`}
      >
        <Histogram
          xScale={xScale}
          yScale={yScale}
          binSize={315360000000}
          brushedArea={null}
          data={dummyData}
          dimensions={dimensions}
        />
      </g>
    </g>
  );
}
