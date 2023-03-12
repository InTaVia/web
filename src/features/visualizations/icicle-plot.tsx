import type { Node, RootNode } from '@intavia/api-client';
import { hierarchy, interpolateRainbow, partition, scaleSequential } from 'd3';

import { useVisualisationDimensions } from '@/features/visualizations/use-visualization-dimensions';
import { VisualizationRoot } from '@/features/visualizations/visualization-root';
import { useElementRef } from '@/lib/use-element-ref';

export interface IciclePlotProps<T extends { id: string }> {
  data: RootNode<T>;
  onChangeSelection?: (selected: Node<T>) => void;
  selectedIds?: Array<T['id']> | null;
}

export function IciclePlot<T extends { id: string }>(props: IciclePlotProps<T>): JSX.Element {
  const { data, onChangeSelection, selectedIds } = props;

  const [containerElement, setContainerElement] = useElementRef();
  const dimensions = useVisualisationDimensions({ element: containerElement });

  const tree = hierarchy(data)
    .sum((d) => {
      return d.count;
    })
    .sort((a, b) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return b.height - a.height || b.value! - a.value!;
    });

  const layout = partition<Node<T>>()
    .size([dimensions.boundedHeight, dimensions.boundedWidth])
    .padding(2);

  const nodes = layout(tree).descendants();

  const color = new Map();
  const palette = scaleSequential([0, tree.children!.length], interpolateRainbow);
  tree.children?.forEach((node, index) => {
    color.set(node.data.id, palette(index));
  });

  const selected = new Set(selectedIds);

  return (
    <VisualizationRoot ref={setContainerElement} dimensions={dimensions}>
      <g>
        {nodes.map((node) => {
          function onClick() {
            onChangeSelection?.(node.data);
          }

          const width = node.y1 - node.y0;
          const height = node.x1 - node.x0;
          const fill = color.get(node.ancestors().at(-2)?.data.id) ?? '#ccc';
          const fontSize = 10;

          return (
            <g key={node.data.id} onClick={onClick} transform={`translate(${node.y0},${node.x0})`}>
              <rect fill={fill} fillOpacity={0.75} height={height} width={width} />
              {selected.has(node.data.id) ? (
                <path d={`M ${width} ${height} m -20 -12 l 2 -2 4 4 8 -8 2 2 -10 10 -6 -6 z`} />
              ) : null}
              {height > fontSize ? (
                <text dy="0.32em" fontSize={fontSize} x={4} y={Math.min(9, height / 2)}>
                  <tspan>{node.data.label}</tspan>
                  <tspan dx={3} fillOpacity={0.75}>
                    ({node.value})
                  </tspan>
                </text>
              ) : null}
              <title>
                {node.data.label} ({node.value})
              </title>
            </g>
          );
        })}
      </g>
    </VisualizationRoot>
  );
}
