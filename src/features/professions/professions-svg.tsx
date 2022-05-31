import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { schemeRdYlGn, interpolateCool, interpolateWarm } from 'd3-scale-chromatic';
import { color as d3color, hsl } from 'd3-color';
import { hierarchy, partition } from 'd3-hierarchy';
import type { HierarchyNode } from 'd3-hierarchy';
import { extent, group } from 'd3-array';
import type { MutableRefObject } from 'react';
import { useEffect, useState } from 'react';

import type { Person } from '@/features/common/entity.model';
import { ProfessionHierarchyNode } from '@/features/professions/profession-hierarchy-node';

type LeafSizing = 'qualitative' | 'quantitative';

interface ProfessionsSvgProps {
  persons: Array<Person>;
  parentRef: MutableRefObject<HTMLDivElement | null>;
  renderLabel: boolean;
  leafSizing?: LeafSizing;
  hovered?: Person['id'] | null;
  setHovered?: (val: Array<Person['id']> | null) => void;
}

const svgMinWidth = 300;
const svgMinHeight = 150;

const noOccupation = Symbol('no occupation');
export type NoOccupation = typeof noOccupation;

export function ProfessionsSvg(props: ProfessionsSvgProps): JSX.Element {
  const {
    parentRef,
    persons,
    renderLabel,
    hovered, setHovered,
    leafSizing = 'quantitative',
  } = props;
  const [svgViewBox, setSvgViewBox] = useState(`0 0 ${svgMinWidth} ${svgMinHeight}`);
  const [svgWidth, setSvgWidth] = useState(svgMinWidth);
  const [svgHeight, setSvgHeight] = useState(svgMinHeight);

  const hierarchyRoot = createHierarchy(persons, leafSizing);
  const allButRootNode = hierarchyRoot.descendants().filter(d => d.depth > 0);

  // x is y, y is x
  const dataXRange: [number, number] = extent<number>(allButRootNode.map(d => [d.y0, d.y1]).flat());

  const xScale = scaleLinear()
    .domain(dataXRange)
    .range([20, svgWidth - 20]);
  const yScale = scaleLinear().range([20, svgHeight - 20]);

  // store colors per node in a map
  const colorMap = new Map<string, string>();

  hierarchyRoot.children.forEach((child, i, arr) => {
    const idx = i / (arr.length - 1);
    const col1 = interpolateCool(idx);
    const hsl1 = hsl(d3color(col1));

    // root color: mostly saturated
    const rootColor = hsl(hsl1.h, 0.8, 0.4);
    colorMap.set(child.data.label, rootColor.toString());

    const childColor1 = hsl(hsl1.h, 0.5, 0.5);
    const childColor2 = hsl(hsl1.h, 0.5, 0.75);
    const childColorScale = scaleLinear()
      .domain([0, Math.max(4, child.children.length - 1)])
      .range([childColor1, childColor2]);

    child.children.forEach((child, i) => {
      const color = childColorScale(i);
      colorMap.set(child.data.label, color);

      // XXX: assume two levels of hierarchy for now, rest is same color
      const grandchildren = child.descendants().filter(d => d.depth !== child.depth);
      grandchildren.forEach(grandchild => colorMap.set(grandchild.data.label, color));
    });
  });

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
        return (
          <ProfessionHierarchyNode
            key={node.data.label}
            x0={node.y0}
            x1={node.y1}
            y0={node.x0}
            y1={node.x1}
            personIds={node.data.personIds}
            scaleX={xScale}
            scaleY={yScale}
            renderLabel={renderLabel}
            hovered={hovered}
            setHovered={setHovered}
            label={node.data.label}
            color={colorMap.get(node.data.label) ?? 'hotpink'} />
        );
      })}
    </svg>
  );
}

function createHierarchy(persons: Array<Person>, leafSizing: LeafSizing) {
  const alphabeticalGroups = [
    ['A-I', /^[a-i]/i],
    ['J-P', /^[j-p]/i],
    ['Q-Z', /^[q-z]/i],
    ['other', /^./i],  // rest
  ];

  const flattened: Array<[typeof alphabeticalGroups[0][0], string | NoOccupation, Person['id']]> = [];
  persons.forEach(person => {
    if (person.occupation === undefined) {
      const alphabeticalGroup = alphabeticalGroups[0][0];
      flattened.push([alphabeticalGroup, noOccupation, person.id]);

      return;
    }

    person.occupation.forEach((occupation) => {
      const alphabeticalGroup = alphabeticalGroups
        .find(([_, regex]) => {
          return regex.test(occupation);
        })
        [0] ?? alphabeticalGroups[alphabeticalGroups.length - 1][0];

      flattened.push([alphabeticalGroup, occupation, person.id]);
    });
  });

  const groupedByProfession = group(flattened,
    d => d[0],
    d => d[1],
  );

  const root = {
    label: 'all',
    personIds: persons.map(d => d.id),
    children: unifyTree(groupedByProfession),
  };

  const leafSizeFn = (leafSizing === 'quantitative')
    ? (node: HierarchyNode<typeof root>): number => node.children ? 0 : node.personIds.length
    : (node: HierarchyNode<typeof root>): number => node.children ? 0 : 1;

  const hier = hierarchy(root)
    .sum(leafSizeFn)
    .sort((a, b) => a.data.label.localeCompare(b.data.label));

  const part = partition()(hier);

  return part;
}

function unifyTree(groupNode) {
  const entries = Array.from(groupNode.entries());
  if (entries[0][1] instanceof Array) {
    // lowest level
    return entries.map(([key, value]) => {
      return {
        label: key,
        personIds: value.map(d => d[2]),
      };
    });
  } else {
    // entries' values are also maps
    return entries.map(([key, value]) => {
      const children = unifyTree(value);
      const personIds = Array.from(new Set<string>(children.map(d => d.personIds).flat()));
      return {
        label: key,
        personIds,
        children,
      };
    });
  }
}
