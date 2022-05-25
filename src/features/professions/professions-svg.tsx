//import { extent } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { hierarchy, partition } from 'd3-hierarchy';
import { group } from 'd3-array';
import type { MutableRefObject } from 'react';
import { useEffect, useState } from 'react';

import type { Person } from '@/features/common/entity.model';
//import { TimelineElement } from '@/features/timeline/timeline-element';
//import { TimelineElementTooltip } from '@/features/timeline/timeline-element-tooltip';
//import { TimelineYearAxis } from '@/features/timeline/timeline-year-axis';

interface ProfessionsSvgProps {
  persons: Array<Person>;
  parentRef: MutableRefObject<HTMLDivElement | null>;
  renderLabel: boolean;
  hovered?: Person['id'] | null;
  setHovered?: (val: Array<Person['id']> | null) => void;
}

const svgMinWidth = 300;
const svgMinHeight = 150;

const noOccupation = Symbol('no occupation');
export type NoOccupation = typeof noOccupation;

export function ProfessionsSvg(props: ProfessionsSvgProps): JSX.Element {
  const { parentRef, persons, renderLabel, hovered, setHovered } = props;
  const [svgViewBox, setSvgViewBox] = useState(`0 0 ${svgMinWidth} ${svgMinHeight}`);
  const [svgWidth, setSvgWidth] = useState(svgMinWidth);
  const [svgHeight, setSvgHeight] = useState(svgMinHeight);

  const x = createHierarchy(persons);
  console.log(x.descendants().slice(1));

  const xScale = scaleLinear().range([20, 300]);
  const yScale = scaleLinear().range([20, 300]);

  const _placateEslint = { parentRef, persons, renderLabel, hovered, setHovered };  // XXX

  useEffect(() => {
    const w = Math.max(svgMinWidth, parentRef.current?.clientWidth ?? 0);
    const h = Math.max(svgMinHeight, parentRef.current?.clientHeight ?? 0);

    setSvgWidth(w);
    setSvgHeight(h);
    setSvgViewBox(`0 0 ${w} ${h}`);
  }, [parentRef]);

  //const timeDomain = zoomToData ? getTemporalExtent(persons) : getTemporalExtent([]);
  //
  //const scaleX = scaleTime()
  //  .domain(timeDomain)
  //  .range([50, svgWidth - 50]);
  //const scaleY = scaleBand()
  //  .domain(
  //    persons.map((d) => {
  //      return d.id;
  //    }),
  //  )
  //  .range([50, svgHeight - 80])
  //  .paddingInner(0.2);

  return (
    <svg
      id="professions"
      width={svgWidth}
      height={svgHeight}
      style={{ minWidth: `${svgMinWidth}px`, minHeight: `${svgMinHeight}px` }}
      viewBox={svgViewBox}
    >
      {x.descendants().slice(1).map((node) => {
        return (
          <g key={node.data.label}>
            <rect x={xScale(node.y0)}
                  y={yScale(node.x0)}
                  width={xScale(node.y1) - xScale(node.y0)}
                  height={yScale(node.x1) - yScale(node.x0)}
                  fill="red" />
            <text x={xScale(node.y0) + 2}
                  y={yScale(node.x0) + 10}>{node.data.label}</text>
          </g>
        );
      })}
      {/**
      <TimelineYearAxis xScale={scaleX} yScale={scaleY} />
      {persons.map((person) => {
        const personProps = { scaleX, scaleY, person, renderLabel, hovered, setHovered };

        return (
          <TimelineElementTooltip key={person.id} {...personProps}>
            <TimelineElement key={person.id} {...personProps} />
          </TimelineElementTooltip>
        );
      })}
      */}
    </svg>
  );
}

function createHierarchy(persons: Array<Person>) {
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


  console.log(groupedByProfession);

  const root = {
    label: 'all',
    personIds: persons.map(d => d.id),
    children: unifyTree(groupedByProfession),
  };
  const hier = hierarchy(root)
    .sum(d => d.children ? 0 : d.personIds.length)
    .sort((a, b) => a.data.label.localeCompare(b.data.label));

  const part = partition()
    .padding(0.005)
    (hier);

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
