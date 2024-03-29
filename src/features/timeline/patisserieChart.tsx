import type { Event } from '@intavia/api-client/dist/models';
import { forwardRef } from 'react';

import { useHoverState } from '@/app/context/hover.context';
import { useAppSelector } from '@/app/store';
import { selectVocabularyEntries } from '@/app/store/intavia.slice';
import {
  getEventKindPropertiesById,
  getEventKindPropertiesByType,
} from '@/features/common/visualization.config';
import { getTranslatedLabel } from '@/lib/get-translated-label';

interface PatisserieChartProperties {
  events: Array<Event>;
  diameter: number;
  patisserieType: 'donut' | 'pie';
  onToggleHighlight?: (
    entities: Array<Entity['id'] | null>,
    events: Array<Event['id'] | null>,
  ) => void;
  highlightedByVis: never | { entities: Array<Entity['id']>; events: Array<Event['id']> };
  hover?: boolean;
  color?: Record<string, string>;
}

const groupBy = (items: Array<any>, key: string) => {
  return items.reduce((result, item) => {
    return {
      ...result,
      [item[key]]: [...(result[item[key]] !== undefined ? result[item[key]] : []), item],
    };
  }, {});
};

const PatisserieChart = forwardRef((props: PatisserieChartProperties, ref): JSX.Element => {
  const { events, diameter, patisserieType, hover = false, color: i_color } = props;

  const { hovered } = useHoverState();

  const vocabularies = useAppSelector(selectVocabularyEntries);

  const groupedEvents = groupBy(events, 'kind');

  const offsets: Array<number> = [];

  const grouped: Array<Array<Event>> = Object.values(groupedEvents);

  let total = 0;
  for (const groupedValue of grouped) {
    offsets.push(total);
    total += groupedValue.length;
  }
  const r =
    total >= 75
      ? (3 * diameter) / 2
      : total >= 25
      ? diameter
      : total >= 5
      ? (2 * diameter) / 3
      : diameter / 2;
  const r0 = Math.round(r * 0.4);
  const w = r * 2;

  return (
    <svg
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      ref={ref}
      width={`${w}`}
      height={`${w}`}
      viewBox={`0 0 ${w} ${w}`}
      textAnchor="middle"
    >
      <circle cx={r} cy={r} r={r - 1} fill="white" stroke="black"></circle>
      <g transform={'translate(1, 1)'}>
        {grouped.map((item: Array<Event>, index) => {
          const allHighlighted = item.every((event) => {
            return (
              hovered?.relatedEvents.includes(event.id) === true ||
              hovered?.events.includes(event.id) === true
            );
          });

          const someHighlighted = item.some((event) => {
            return (
              hovered?.relatedEvents.includes(event.id) === true ||
              hovered?.events.includes(event.id) === true
            );
          });

          const translatedEventKind =
            item[0].kind in vocabularies
              ? getTranslatedLabel(vocabularies[item[0].kind].label)
              : item[0].kind;
          const type = getEventKindPropertiesById(translatedEventKind).type;

          const color = i_color != null ? i_color : getEventKindPropertiesByType(type).color;

          const offset = (offsets[index] != null ? offsets[index] : 0) as number;
          return donutSegment(
            offset / total,
            (offset + item.length) / total,
            r - 1,
            r0 - 1,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            color,
            patisserieType,
            `${index}${JSON.stringify(events)}segment`,
            allHighlighted,
            someHighlighted,
          );
        })}
      </g>
    </svg>
  );
});

function donutSegment(
  start: number,
  i_end: number,
  r: number,
  r0: number,
  color: { foreground: string; background: string },
  patisserieType: 'donut' | 'pie',
  key: string,
  allHighlighted: boolean,
  someHighlighted: boolean,
) {
  let end = i_end;
  if (end - start === 1) end -= 0.00001;
  const a0 = 2 * Math.PI * (start - 0.25);
  const a1 = 2 * Math.PI * (end - 0.25);
  const x0 = Math.cos(a0),
    y0 = Math.sin(a0);
  const x1 = Math.cos(a1),
    y1 = Math.sin(a1);
  const largeArc = end - start > 0.5 ? 1 : 0;

  if (patisserieType === 'donut') {
    return (
      <path
        key={key}
        d={`M ${r + r0 * x0} ${r + r0 * y0} L ${r + r * x0} ${
          r + r * y0
        } A ${r} ${r} 0 ${largeArc} 1 ${r + r * x1} ${r + r * y1} L ${r + r0 * x1} ${
          r + r0 * y1
        } A ${r0} ${r0} 0 ${largeArc} 0 ${r + r0 * x0} ${r + r0 * y0}`}
        fill={someHighlighted || allHighlighted ? color.dark : color.main}
        strokeWidth={allHighlighted || someHighlighted ? 2 : 0}
        stroke={allHighlighted || someHighlighted ? color.dark : 'none'}
        strokeLinecap="round"
        strokeDasharray={!allHighlighted && someHighlighted ? '4' : 'none'}
      />
    );
  } else {
    return (
      <path
        key={key}
        d={`M ${r} ${r} L ${r + r * x0} ${r + r * y0} A ${r} ${r} 0 ${largeArc} 1 ${r + r * x1} ${
          r + r * y1
        } Z`}
        fill={someHighlighted || allHighlighted ? color.dark : color.main}
        strokeWidth={allHighlighted || someHighlighted ? 2 : 0}
        stroke={allHighlighted || someHighlighted ? color.dark : 'none'}
        strokeLinecap="round"
        strokeDasharray={!allHighlighted && someHighlighted ? '4' : 'none'}
      />
    );
  }
}

PatisserieChart.displayName = 'PatisserieChart';

export default PatisserieChart;
