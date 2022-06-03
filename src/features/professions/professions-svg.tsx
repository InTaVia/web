import { extent, max } from 'd3-array';
import { hsl } from 'd3-color';
import type { HierarchyRectangularNode } from 'd3-hierarchy';
import { partition, stratify } from 'd3-hierarchy';
import { scaleLinear } from 'd3-scale';
import { interpolateCool } from 'd3-scale-chromatic';
import type { MutableRefObject } from 'react';
import { useEffect, useState } from 'react';

import type { Profession } from '@/features/common/entity.model';
import { ProfessionHierarchyNode } from '@/features/professions/profession-hierarchy-node';
import type { ToggleProfessionFn } from '@/features/professions/professions';
import { Origin } from '@/features/visual-querying/Origin';
import type { ProfessionConstraint } from '@/features/visual-querying/visualQuerying.slice';

export enum LeafSizing {
  Qualitative,
  QualitativeWithBar,
  Quantitative,
}

interface ProfessionsSvgProps {
  professions: Array<Profession & { count: number }>;
  parentRef: MutableRefObject<HTMLDivElement | null>;
  renderLabel: boolean;
  leafSizing?: LeafSizing;
  constraint?: ProfessionConstraint;
  toggleProfession: ToggleProfessionFn;
  origin: Origin;
}

const svgMinWidth = 300;
const svgMinHeight = 150;

export function ProfessionsSvg(props: ProfessionsSvgProps): JSX.Element {
  const {
    parentRef,
    professions,
    renderLabel,
    leafSizing = LeafSizing.Quantitative,
    constraint,
    toggleProfession,
  } = props;

  const [svgViewBox, setSvgViewBox] = useState(`0 0 ${svgMinWidth} ${svgMinHeight}`);
  const [svgWidth, setSvgWidth] = useState(svgMinWidth);
  const [svgHeight, setSvgHeight] = useState(svgMinHeight);

  const hierarchyRoot = createHierarchy(professions, leafSizing);
  const allButRootNode = hierarchyRoot.descendants().filter((d) => {
    return d.depth > 0;
  });

  // do not use origin, svg must have viewBox starting at 0 0
  const origin = new Origin();

  // x is y, y is x
  const dataXRange: [number, number] = extent<number>(
    allButRootNode
      .map((d) => {
        return [d.y0, d.y1];
      })
      .flat(),
  ) as [number, number];

  const xScale = scaleLinear()
    .domain(dataXRange)
    .range([origin.x(20), origin.x(svgWidth - 20)]);
  const yScale = scaleLinear().range([origin.y(20), origin.y(svgHeight - 20)]);

  // store colors per node in a map
  const colorMap = new Map<string, number>();

  hierarchyRoot.children?.forEach((child, i, arr) => {
    const idx = i / (arr.length - 1);
    const col1 = interpolateCool(idx);
    const hsl1 = hsl(col1);

    child.descendants().forEach((d) => {
      return colorMap.set(d.data.name, hsl1.h);
    });
  });

  const maxChildValue =
    max<number>(
      hierarchyRoot.leaves().map((d) => {
        return d.data.count;
      }),
    ) ?? 1;

  useEffect(() => {
    const w = Math.max(svgMinWidth, parentRef.current?.clientWidth ?? 0);
    const h = Math.max(svgMinHeight, parentRef.current?.clientHeight ?? 0);

    setSvgWidth(w);
    setSvgHeight(h);
    setSvgViewBox(`0 0 ${w} ${h}`);
  }, [parentRef]);

  return (
    <svg
      id="professions"
      width={svgWidth}
      height={svgHeight}
      style={{ minWidth: `${svgMinWidth}px`, minHeight: `${svgMinHeight}px` }}
      viewBox={svgViewBox}
    >
      {allButRootNode.map((node) => {
        const label = node.data.name;
        const professionIds: Array<string> = node.leaves().map((d) => {
          return d.data.name;
        });

        const nodeHue = colorMap.get(node.data.name)!;
        const bgLightness = node.depth === 1 ? 0.4 : 0.6;
        const fgLightness = 0.5;
        const colorBackground = hsl(nodeHue, node.depth === 1 ? 0.5 : 0.3, bgLightness).toString();
        const colorForeground = hsl(nodeHue, 0.4, fgLightness).toString();

        return (
          <ProfessionHierarchyNode
            key={label}
            x0={node.y0}
            x1={node.y1}
            y0={node.x0}
            y1={node.x1}
            professionIds={professionIds}
            scaleX={xScale}
            scaleY={yScale}
            renderLabel={renderLabel}
            label={label}
            colorForeground={colorForeground}
            colorBackground={colorBackground}
            isLeaf={node.depth === hierarchyRoot.height}
            barWidth={node.data.count / maxChildValue}
            leafSizing={leafSizing}
            profession={node.data}
            selectable={Boolean(constraint)}
            selected={constraint?.selection?.includes(node.data.name) ?? false}
            toggleProfession={toggleProfession}
          />
        );
      })}
    </svg>
  );
}

type _HierarchyData = Profession & { count: number };

function createHierarchy(
  professions: Array<_HierarchyData>,
  leafSizing: LeafSizing,
): HierarchyRectangularNode<_HierarchyData> {
  const hier = stratify<_HierarchyData>()
    .id((d) => {
      return d.name;
    })
    .parentId((d) => {
      return d.parent;
    })([
    { name: 'root', parent: null, count: 0 },
    ...professions.map((d) => {
      if (d.parent === null) return { ...d, parent: 'root' };
      return d;
    }),
  ]);

  // remove empty categories from top level
  hier.children =
    hier.children?.filter((d) => {
      return d.children?.length;
    }) ?? [];

  const leaves = hier.leaves().map((d) => {
    return d.data.name;
  });
  const leafSizeFn =
    leafSizing === LeafSizing.Quantitative
      ? (node: _HierarchyData): number => {
          return node.count;
        }
      : (node: _HierarchyData): number => {
          return leaves.includes(node.name) ? 1 : 0;
        };

  const hier2 = hier.sum(leafSizeFn).sort((a, b) => {
    // "other" category at end
    if (a.depth === 1 && a.data.name === 'other') return 1;
    if (b.depth === 1 && b.data.name === 'other') return -1;

    return a.data.name.localeCompare(b.data.name);
  });

  const part = partition<_HierarchyData>()(hier2);

  return part;
}
