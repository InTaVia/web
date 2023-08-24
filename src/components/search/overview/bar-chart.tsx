import type { EntityKind, EntityTypeStatisticsSearch } from '@intavia/api-client';
import { axisBottom, axisLeft, format, scaleBand, scaleLinear, select } from 'd3';
import { useEffect, useRef } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { useVisualisationDimensions } from '@/features/visualizations/use-visualization-dimensions';
import { VisualizationRoot } from '@/features/visualizations/visualization-root';
import { useElementRef } from '@/lib/use-element-ref';

interface BarChartProps {
  data: EntityTypeStatisticsSearch.Response;
}

export function BarChart(props: BarChartProps): JSX.Element {
  const { data } = props;

  const { t } = useI18n<'common'>();

  const entityTypes = Object.keys(data);
  const entityCounts = Object.values(data);

  const [containerElement, setContainerElement] = useElementRef();
  const dimensions = useVisualisationDimensions({
    element: containerElement,
    dimensions: { marginLeft: 43, marginRight: 0, marginBottom: 24 },
  });
  const xAxisRef = useRef<SVGGElement>(null);
  const yAxisRef = useRef<SVGGElement>(null);

  const xScale = scaleBand()
    .domain(
      entityTypes.map((d) => {
        return t(['common', 'entity', 'kinds', d as EntityKind, 'other']);
      }),
    )
    .range([0, dimensions.boundedWidth])
    .padding(0.2);
  const yScale = scaleLinear()
    .domain([0, Math.max(...entityCounts)])
    .range([dimensions.boundedHeight, 0]);

  const yAxisTicks = yScale.ticks().filter((tick) => {
    return Number.isInteger(tick);
  });

  const xAxis = axisBottom(xScale).tickSize(0).tickPadding(8);
  const yAxis = axisLeft(yScale).tickValues(yAxisTicks).tickFormat(format('d'));

  useEffect(() => {
    if (xAxisRef.current == null || yAxisRef.current == null) return;

    select(xAxisRef.current)
      .attr('transform', `translate(0, ${yScale(0)})`)
      .call(xAxis);
    select(yAxisRef.current).attr('transform', `translate(${xScale.range()[0]}, 0)`).call(yAxis);
  }, [xAxis, xScale, yAxis, yScale]);

  return (
    <VisualizationRoot ref={setContainerElement} dimensions={dimensions}>
      <g>
        {Object.entries(data).map(([label, count], index) => {
          const x = xScale(t(['common', 'entity', 'kinds', label as EntityKind, 'other']));
          const w = xScale.bandwidth();
          const y = yScale(count);
          const h = yScale(0) - y;

          return (
            <g key={index}>
              <rect width={w} height={h} x={x} y={y} fill="#cbd5e1" stroke="#f8fafc" />
              <text
                fontSize="0.75em"
                x={x! + w / 2}
                y={y - 12}
                alignmentBaseline="central"
                textAnchor="middle"
              >
                {count}
              </text>
            </g>
          );
        })}
      </g>

      <g>
        <g ref={xAxisRef} />
        <g ref={yAxisRef} />
      </g>
    </VisualizationRoot>
  );
}
