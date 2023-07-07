import 'maplibre-gl/dist/maplibre-gl.css';

import type { EntityRelationRole, Event } from '@intavia/api-client/dist/models';
import type { MouseEvent } from 'react';
import { forwardRef, useMemo, useState } from 'react';

import { useHoverState } from '@/app/context/hover.context';
import { PageContext } from '@/app/context/page.context';
import { useAppSelector } from '@/app/store';
import { selectVocabularyEntries } from '@/app/store/intavia.slice';
import {
  getEventKindById,
  getEventKindPropertiesById,
} from '@/features/common/visualization.config';
import {
  type TimelineType,
  getTemporalExtent,
  translateEventType,
} from '@/features/timeline/timeline';
import { getTranslatedLabel } from '@/lib/get-translated-label';

import TimelineEventMarker from './timelineEventMarker';
import { TimelineLabel } from './timelineLabel';

interface TimelineEventProps {
  id: string;
  event: Event;
  roles?: Array<EntityRelationRole['id']>;
  vertical?: boolean;
  timeScale: (toBeScaled: Date) => number;
  midOffset: number;
  timeScaleOffset: number;
  entityIndex: number;
  thickness?: number;
  showLabels: boolean;
  overlapIndex: number;
  overlap: boolean;
  mode?: TimelineType;
  diameter?: number;
  fontSize?: number;
  colorBy: 'entity-identity' | 'event-kind' | 'time';
  color?: string;
  onClick: () => void;
  highlightedByVis: never | { entities: Array<Entity['id']>; events: Array<Event['id']> };
  timeColorScale: (date: Date) => string;
}

const TimelineEvent = forwardRef((props: TimelineEventProps, ref): JSX.Element => {
  const {
    id,
    event,
    roles = [],
    vertical = false,
    timeScale,
    midOffset,
    timeScaleOffset,
    entityIndex,
    thickness: i_thickness = 1,
    showLabels,
    overlapIndex,
    colorBy = 'event-kind',
    overlap = false,
    mode = 'default',
    diameter = 16,
    fontSize = 10,
    onClick,
    highlightedByVis,
    timeColorScale,
    color: i_color,
  } = props;

  const [hover, setHover] = useState(false);

  const { hovered, updateHover } = useHoverState();

  const eventExtent = getTemporalExtent([[event]]);
  const extentDiffInYears = eventExtent[1].getUTCFullYear() - eventExtent[0].getUTCFullYear();

  const eventMidDate = new Date(eventExtent[0].getTime() + eventExtent[1].getTime()) / 2;

  const {
    color: eventKindColor,
    shape,
    strokeWidth: eventKindStrokeWidth,
  } = getEventKindPropertiesById(event.kind);

  const color = useMemo(() => {
    if (colorBy === 'time') {
      if (timeColorScale != null) {
        return timeColorScale(eventMidDate);
      }
    } else if (colorBy === 'entity-identity') {
      if (i_color != null) {
        return i_color;
      }
    } else {
      return eventKindColor;
    }
  }, [eventKindColor, colorBy, i_color, eventMidDate, timeColorScale]);

  const selected = useMemo(() => {
    if (highlightedByVis == null || highlightedByVis.events == null) return false;
    return highlightedByVis.events.includes(event.id);
  }, [event.id, highlightedByVis]);

  const thickness = 2;
  //console.log(thickness, i_thickness, selected);
  let diameterWithStroke = diameter + thickness * 2;

  if (selected) {
    diameterWithStroke = diameterWithStroke * 1.5;
  }

  const overlapOffset = overlapIndex >= 0 ? overlapIndex * diameterWithStroke : 0;

  let posX: number, posY: number;
  let className = 'timeline-event';

  if (vertical) {
    posX = midOffset - overlapOffset;
    posY =
      timeScale(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        new Date(eventExtent[0].getTime() + eventExtent[1].getTime()) / 2,
      ) - timeScaleOffset;
  } else {
    posX =
      timeScale(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        new Date(eventExtent[0].getTime() + eventExtent[1].getTime()) / 2,
      ) - timeScaleOffset;
    posY = midOffset - overlapOffset;
  }

  let width, height;
  if (extentDiffInYears > 1 && (overlap || hover)) {
    if (vertical) {
      width = diameterWithStroke;
      height = timeScale(eventExtent[1]) - timeScale(eventExtent[0]);
      posX = posX - diameterWithStroke / 2;
      posY = timeScale(eventExtent[0]) - timeScaleOffset;
    } else {
      width = timeScale(eventExtent[1]) - timeScale(eventExtent[0]);
      height = diameterWithStroke;
      posX = timeScale(eventExtent[0]) - timeScaleOffset;
      posY = posY - diameterWithStroke / 2;
    }
  } else {
    width = diameterWithStroke;
    height = diameterWithStroke;
    posX = posX - diameterWithStroke / 2;
    posY = posY - diameterWithStroke / 2;
    className = className + ' hover-animation';
  }

  /* const type = translateEventType(
    vocabularies[event.kind],
    roles
      .map((roleId) => {
        return vocabularies[roleId];
      })
      .filter((entry) => {
        return entry !== undefined;
      }),
  ); */

  /*   function onClick() {
    if (pageContext.page === 'story-creator') {
      onToggleSelection?.([id as string]);
    }
  } */

  return (
    <>
      <div
        id={id}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        ref={ref}
        style={{
          position: 'absolute',
          left: posX,
          top: posY,
          width: `${width}px`,
          height: `${height}px`,
          cursor: 'pointer',
        }}
        className={`${className}`}
        onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
          updateHover({
            entities: [],
            events: [event.id],
            clientRect: {
              left: e.clientX,
              top: e.clientY,
            } as DOMRect,
            pageRect: { left: e.pageX, top: e.pageY } as DOMRect,
          });
          setHover(true);
        }}
        onMouseLeave={() => {
          updateHover(null);
          setHover(false);
        }}
        /* onClick={() => {
          updateHover(null);
          void router.push(`/entities/${linkedEntityID}`);
        }} */
        onClick={onClick}
      >
        <svg style={{ width: `${width}px`, height: `${height}px` }} width={width} height={height}>
          <TimelineEventMarker
            //key={`${JSON.stringify(event)}${colorBy}${selected}`}
            width={width}
            height={height}
            thickness={thickness}
            color={color}
            shape={shape}
            hover={
              hover ||
              hovered?.events.includes(event.id) === true ||
              hovered?.relatedEvents.includes(event.id) === true
                ? true
                : false
            }
            selected={selected}
          />
        </svg>
        <TimelineLabel
          posX={posX}
          posY={posY}
          labelText={getTranslatedLabel(event.label)}
          showLabels={hover ? true : showLabels}
          entityIndex={entityIndex}
          mode={mode}
          thickness={thickness}
          vertical={vertical}
          fontSize={fontSize}
          selected={selected}
        />
      </div>
    </>
  );
});

TimelineEvent.displayName = 'TimelineEvent';
export default TimelineEvent;
