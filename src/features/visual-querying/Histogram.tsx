import type { Bin } from 'd3-array';
import { max } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { brushX } from 'd3-brush';
import { format } from 'd3-format';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { useEffect, useRef } from 'react';

import type { Origin } from '@/features/visual-querying/Origin';

interface HistogramProps {
  data: {
    minYear: number;
    maxYear: number;
    thresholds: Array<number>;
    bins: Array<Bin<number, number>>;
  };
  brushedArea: Array<number> | null;
  setBrushedArea: (area: Array<number>) => void;
  dimensions: {
    x: number;
    y: number;
    width: number;
    height: number;
    boundedWidth: number;
    boundedHeight: number;
    marginLeft: number;
    marginTop: number;
  };
  origin: Origin;
}

export function Histogram(props: HistogramProps) {
  const { data, dimensions, origin } = props;

  const { minYear, maxYear, thresholds, bins } = data;
  const Y = Array.from(bins, (bin) => {
    return bin.length;
  });

  const binSize = thresholds.length > 1 ? thresholds[1]! - thresholds[0]! : 10;

  const ref = useRef<SVGGElement>(null);

  const xScale = scaleLinear()
    .domain([minYear, maxYear])
    .range([origin.x(0), origin.x(dimensions.width - 100)]);

  const yScale = scaleLinear()
    .domain([0, max(Y) as number])
    .range([origin.y(0), origin.y(50 - dimensions.height)]);

  const xAxisRef = useRef<SVGGElement>(null);
  const yAxisRef = useRef<SVGGElement>(null);

  const lastTickValue = [thresholds[thresholds.length - 1]! + binSize];

  const xAxis = axisBottom(xScale)
    .tickValues(thresholds.concat(lastTickValue))
    .tickFormat(format('d'));
  const yAxis = axisLeft(yScale);

  // Add brush
  useEffect(() => {
    const g = select(ref.current);

    const brush = brushX<null>().extent([
      [xScale.range()[0] as number, yScale.range()[1] as number],
      [xScale.range()[1] as number, yScale.range()[0] as number],
    ]);

    const selection = g.selectAll<SVGGElement, null>('g.our-brush').data([null]);
    const sel = selection
      .enter()
      .append('g')
      .classed('our-brush', true)
      .merge(selection)
      .call(brush);
    selection.exit().remove();

    brush.move(
      sel,
      props.brushedArea === null ? null : (props.brushedArea.map(xScale) as [number, number]),
    );
    brush.on('end', (e) => {
      const extent = e.selection;
      const years =
        extent === null
          ? null
          : extent.map((d: number) => {
              return Math.trunc(xScale.invert(d));
            });
      props.setBrushedArea(years);
    });
  }, [dimensions, props, xScale, yScale]);

  // Add axes
  useEffect(() => {
    if (xAxisRef.current)
      select(xAxisRef.current)
        .attr('transform', `translate(0, ${yScale(0)})`)
        .call(xAxis);
    if (yAxisRef.current)
      select(yAxisRef.current).attr('transform', `translate(${xScale.range()[0]}, 0)`).call(yAxis);
  });

  return (
    <g ref={ref}>
      <g>
        <g ref={xAxisRef} />
        <g ref={yAxisRef} />
      </g>

      {bins.map((bin, idx) => {
        const x = xScale(thresholds[idx]!);
        const w = xScale(thresholds[idx]! + binSize) - x;
        const y = yScale(bin.length);
        const h = yScale(0) - y;

        return <rect key={idx} width={w} height={h} x={x} y={y} fill="lightGray" />;
      })}
    </g>
  );
}
