import { axisBottom } from 'd3-axis';
import { brushX } from 'd3-brush';
import type { ScaleBand, ScaleTime } from 'd3-scale';
import { select } from 'd3-selection';
import { timeFormat } from 'd3-time-format';
import { useEffect, useRef } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store';
import { selectTimeRangeBrush, setTimeRangeBrush } from '@/features/timeline/timeline.slice';

interface TimelineYearAxisProps<_T> {
  xScale: ScaleTime<number, number>;
  yScale: ScaleBand<_T>;
}

export function TimelineYearAxis<_T>(props: TimelineYearAxisProps<_T>): JSX.Element {
  const { xScale, yScale } = props;

  const dispatch = useAppDispatch();
  const brushRange = useAppSelector(selectTimeRangeBrush);

  const brushRef = useRef<SVGGElement>(null);
  const axisRef = useRef<SVGGElement>(null);

  // repaint axis
  useEffect(() => {
    if (axisRef.current) {
      const sel = select(axisRef.current);
      const ax = axisBottom<Date>(xScale).tickFormat(timeFormat('%Y'));
      sel.call(ax);
      sel.attr('transform', `translate(0, ${yScale.range()[1] + 10})`);

      // vertical grid lines for each axis tick
      const dateTicks = sel.selectAll<SVGGElement, Date>('g.tick').data();
      sel
        .selectAll<SVGPathElement, Date>('.dummy')
        .data(dateTicks)
        .enter()
        .append('path')
        .attr('stroke-width', 1)
        .attr('stroke', 'black')
        .attr('stroke-opacity', 0.2)
        .attr('shape-rendering', 'crispEdges')
        .attr('d', (date) => {
          const x = xScale(date);
          const [y0, y1] = yScale.range();

          return `M ${x} 0 V ${y0 - y1 - 20}`;
        });

      return () => {
        sel.html('');
      };
    }
  }, [xScale, yScale, axisRef]);

  // timeline brush
  useEffect(() => {
    if (!brushRef.current) return;

    const xRange = xScale.range() as [number, number];
    const yRange = [yScale.range()[0] - 10, yScale.range()[1] + 40] as [number, number];
    const extent: [[number, number], [number, number]] = [
      [xRange[0], yRange[0]],
      [xRange[1], yRange[1]],
    ];

    const sel = select<SVGGElement, number>(brushRef.current);
    const brush = brushX<number>().extent(extent);
    const moveTo = brushRange?.map((d: Date): number => {
      return xScale(d);
    }) as [number, number] | null;
    sel.call(brush);

    brush.move(sel, moveTo);

    // do not handle first call
    brush.on('end', (evt) => {
      dispatch(
        setTimeRangeBrush(
          evt.selection?.map((d: number): Date => {
            return xScale.invert(d);
          }) as [Date, Date] | null,
        ),
      );
    });
  }, [brushRange, xScale, yScale, brushRef, dispatch]);

  return (
    <g id="x-axis">
      <g id="x-axis__brush" ref={brushRef}></g>
      <g id="x-axis__axis" ref={axisRef}></g>
    </g>
  );
}
