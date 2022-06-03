import type { InternMap } from 'd3-array';
import { extent, group, max } from 'd3-array';
import { hsl } from 'd3-color';
import type { HierarchyRectangularNode } from 'd3-hierarchy';
import { hierarchy, partition } from 'd3-hierarchy';
import { scaleLinear } from 'd3-scale';
import { interpolateCool } from 'd3-scale-chromatic';
import type { MutableRefObject } from 'react';
import { useEffect, useState } from 'react';

import type { Person } from '@/features/common/entity.model';
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
  persons: Array<Person>;
  parentRef: MutableRefObject<HTMLDivElement | null>;
  renderLabel: boolean;
  leafSizing?: LeafSizing;
  hovered?: Array<Person['id']> | null;
  setHovered?: (val: Array<Person['id']> | null) => void;
  constraint?: ProfessionConstraint;
  toggleProfession: ToggleProfessionFn;
  origin: Origin;
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
    hovered,
    setHovered,
    leafSizing = LeafSizing.Quantitative,
    constraint,
    toggleProfession,
  } = props;

  const [svgViewBox, setSvgViewBox] = useState(`0 0 ${svgMinWidth} ${svgMinHeight}`);
  const [svgWidth, setSvgWidth] = useState(svgMinWidth);
  const [svgHeight, setSvgHeight] = useState(svgMinHeight);

  const hierarchyRoot = createHierarchy(persons, leafSizing);
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
  const colorMap = new Map<NoOccupation | string, number>();

  hierarchyRoot.children?.forEach((child, i, arr) => {
    const idx = i / (arr.length - 1);
    const col1 = interpolateCool(idx);
    const hsl1 = hsl(col1);

    child.descendants().forEach((d) => {
      return colorMap.set(d.data.label, hsl1.h);
    });
  });

  const maxChildValue =
    max<number>(
      hierarchyRoot.leaves().map((d) => {
        return d.data.personIds.length;
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
        const label = node.data.label === noOccupation ? 'no occupation' : node.data.label;
        const professionIds: Array<string> =
          node.data.label === noOccupation
            ? []
            : (node
                .descendants()
                .filter((d) => {
                  return (d.children?.length ?? 0) === 0;
                })
                .map((d) => {
                  return d.data.label;
                })
                .filter((d) => {
                  return typeof d === 'string';
                }) as Array<string>);

        const nodeHue = colorMap.get(node.data.label)!;
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
            personIds={node.data.personIds}
            professionIds={professionIds}
            scaleX={xScale}
            scaleY={yScale}
            renderLabel={renderLabel}
            hovered={hovered}
            setHovered={setHovered}
            label={label}
            colorForeground={colorForeground}
            colorBackground={colorBackground}
            isLeaf={node.depth === hierarchyRoot.height}
            barWidth={node.data.personIds.length / maxChildValue}
            leafSizing={leafSizing}
            selectable={Boolean(constraint)}
            selected={constraint?.selection?.includes(node.data.label as string) ?? false}
            toggleProfession={toggleProfession}
          />
        );
      })}
    </svg>
  );
}

// XXX use alphabetical groups for now, with the mock data
const alphabeticalGroups: Array<[string, RegExp]> = [
  ['A-I', /^[a-i]/i],
  ['J-P', /^[j-p]/i],
  ['Q-Z', /^[q-z]/i],
  ['other', /^./i], // rest
];

type OccupationEntryTriple = [typeof alphabeticalGroups[0][0], NoOccupation | string, Person['id']];
interface OccupationTreeEntry {
  label: NoOccupation | string;
  personIds: Array<Person['id']>;
  children?: Array<OccupationTreeEntry>;
}
type ProfessionGroupingResult =
  | Array<OccupationEntryTriple>
  | InternMap<OccupationTreeEntry['label'], ProfessionGroupingResult>;
type ParentProfessionGroupingResult = InternMap<
  OccupationTreeEntry['label'],
  ProfessionGroupingResult
>;

function createHierarchy(
  persons: Array<Person>,
  leafSizing: LeafSizing,
): HierarchyRectangularNode<OccupationTreeEntry> {
  const flattened: Array<OccupationEntryTriple> = [];
  persons.forEach((person) => {
    if (person.occupation.length === 0) {
      flattened.push(['other', noOccupation, person.id]);

      return;
    }

    person.occupation.forEach((occupation) => {
      const [alphabeticalGroup, _] = alphabeticalGroups.find(([_, regex]) => {
        return regex.test(occupation);
      }) ?? ['other', null];

      flattened.push([alphabeticalGroup, occupation, person.id]);
    });
  });

  const groupedByProfession = group(
    flattened,
    (d) => {
      return d[0];
    },
    (d) => {
      return d[1];
    },
  );

  const root: OccupationTreeEntry = {
    label: 'all',
    personIds: persons.map((d) => {
      return d.id;
    }),
    children: unifyTree(groupedByProfession),
  };

  const leafSizeFn =
    leafSizing === LeafSizing.Quantitative
      ? (node: OccupationTreeEntry): number => {
          return node.children ? 0 : node.personIds.length;
        }
      : (node: OccupationTreeEntry): number => {
          return node.children ? 0 : 1;
        };

  const hier = hierarchy<OccupationTreeEntry>(root)
    .sum(leafSizeFn)
    .sort((a, b) => {
      // no occupation: first
      if (a.data.label === noOccupation) return -1;
      if (b.data.label === noOccupation) return 1;

      return a.data.label.localeCompare(b.data.label);
    });

  const part = partition<OccupationTreeEntry>()(hier);

  return part;
}

/**
 * Take the result of a multi-level `d3.group`, and return an object that can
 * be fed into `d3.hierarchy`.
 */
function unifyTree(groupNode: ParentProfessionGroupingResult): Array<OccupationTreeEntry> {
  const entries = Array.from(groupNode.entries());
  if (entries.at(0)?.at(1) instanceof Array) {
    // lowest level
    return entries.map(([key, value]) => {
      return {
        label: key,
        personIds: (value as Array<OccupationEntryTriple>).map((d) => {
          return d[2];
        }),
      };
    });
  } else {
    // entries' values are also maps
    return entries.map(([key, value]) => {
      const children = unifyTree(value as ParentProfessionGroupingResult);
      const personIds = Array.from(
        new Set<string>(
          children
            .map((d) => {
              return d.personIds;
            })
            .flat(),
        ),
      );
      return {
        label: key,
        personIds,
        children,
      };
    });
  }
}
