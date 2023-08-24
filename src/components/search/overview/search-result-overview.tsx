import type { EntityTypeStatisticsSearch } from '@intavia/api-client';
import { LoadingIndicator } from '@intavia/ui';
import { axisBottom, axisLeft, format, scaleBand, scaleLinear, select } from 'd3';
import { useEffect, useRef } from 'react';

import { useSearchEntityTypeStatisticsQuery } from '@/api/intavia.service';
import { useSearchEntitiesFilters } from '@/components/search/use-search-entities-filters';
import { useVisualisationDimensions } from '@/features/visualizations/use-visualization-dimensions';
import { VisualizationRoot } from '@/features/visualizations/visualization-root';
import { useElementRef } from '@/lib/use-element-ref';

export function SearchResultOverview(): JSX.Element {
  const searchEntitiesFilters = useSearchEntitiesFilters();
  const entityTypeQuery = useSearchEntityTypeStatisticsQuery(searchEntitiesFilters);

  const isFetching = entityTypeQuery.isFetching;

  if (isFetching) {
    return (
      <div className="grid place-items-center py-8">
        <LoadingIndicator />
      </div>
    );
  }

  if (entityTypeQuery.data === undefined) {
    return (
      <div className="grid place-items-center py-8">
        <p>No entity type statistical data available :(</p>
      </div>
    );
  }

  return (
    <div>
      <BarChart data={entityTypeQuery.data} />
    </div>
  );
}

interface BarChartProps {
  data: EntityTypeStatisticsSearch.Response;
}

function BarChart(props: BarChartProps): JSX.Element {
  const { data } = props;

  const entityTypes = Object.keys(data);
  const entityCounts = Object.values(data);

  const [containerElement, setContainerElement] = useElementRef();
  const dimensions = useVisualisationDimensions({
    element: containerElement,
    dimensions: { marginLeft: 64 },
  });
  const xAxisRef = useRef<SVGGElement>(null);
  const yAxisRef = useRef<SVGGElement>(null);

  const xScale = scaleBand().domain(entityTypes).range([0, dimensions.boundedWidth]).padding(0.2);
  const yScale = scaleLinear()
    .domain([0, Math.max(...entityCounts)])
    .range([dimensions.boundedHeight, 0]);

  const yAxisTicks = yScale.ticks().filter((tick) => {
    return Number.isInteger(tick);
  });

  const xAxis = axisBottom(xScale);
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
          const x = xScale(label);
          const w = xScale.bandwidth();
          const y = yScale(count);
          const h = yScale(0) - y;

          return (
            <rect key={index} width={w} height={h} x={x} y={y} fill="#cbd5e1" stroke="#f8fafc" />
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
