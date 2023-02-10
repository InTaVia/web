import 'maplibre-gl/dist/maplibre-gl.css';

import type { AxisScale } from 'd3-axis';
import { axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
import { timeFormat } from 'd3-time-format';
import { useEffect, useRef } from 'react';

interface TimelineAxisProps {
  timeScale: AxisScale<Date>;
  vertical: boolean;
  width: number;
  height: number;
}

export function TimelineAxis(props: TimelineAxisProps): JSX.Element {
  const { timeScale, width = 100, height = 50, vertical = false } = props;

  const axisRef = useRef<SVGGElement>(null);

  // repaint axis
  useEffect(() => {
    if (axisRef.current) {
      const sel = select(axisRef.current);
      let ax;

      if (vertical) {
        ax = axisLeft<Date>(timeScale).tickFormat(timeFormat('%Y'));
      } else {
        ax = axisBottom<Date>(timeScale).tickFormat(timeFormat('%Y'));
      }

      sel.call(ax);

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
        .attr('d', (date: Date) => {
          const x = timeScale(date);

          if (vertical) {
            return `M -10 ${x}`;
          } else {
            return `M ${x} 20`;
          }
        });

      return () => {
        sel.html('');
      };
    }
  }, [timeScale, axisRef]);

  return (
    <div
      className={`absolute ${vertical === true ? 'top-0' : 'bottom-0'} left-0`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <svg width={`${width}`} height={`${height}`}>
        <g
          id="x-axis__axis"
          transform={`translate(${vertical ? width - 1 : 0} ${vertical ? 0 : 0})`}
          ref={axisRef}
        ></g>
      </svg>
    </div>
  );
}
