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
  onClick: () => void;
  highlightedByVis: never | { entities: Array<Entity['id']>; events: Array<Event['id']> };
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
    overlap = false,
    mode = 'default',
    diameter = 16,
    fontSize = 10,
    onClick,
    highlightedByVis,
  } = props;

  const [hover, setHover] = useState(false);

  const { hovered, updateHover } = useHoverState();

  const eventExtent = getTemporalExtent([[event]]);
  const extentDiffInYears = eventExtent[1].getUTCFullYear() - eventExtent[0].getUTCFullYear();

  const selected = useMemo(() => {
    if (highlightedByVis == null || highlightedByVis.events == null) return false;
    return highlightedByVis.events.includes(event.id);
  }, [event.id, highlightedByVis]);

  const thickness = selected ? 2 * i_thickness : i_thickness;
  //console.log(thickness, i_thickness, selected);
  const diameterWithStroke = diameter + thickness * 3;

  const overlapOffset = overlapIndex >= 0 ? overlapIndex * diameterWithStroke : 0;

  let posX: number, posY: number;
  let className = 'timeline-event';

  if (vertical) {
    posX = midOffset + Math.floor(thickness / 2) - overlapOffset;
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
    posY = midOffset + Math.floor(thickness / 2) - overlapOffset;
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
            event={event}
            width={width}
            height={height}
            thickness={thickness}
            hover={
              hover ||
              hovered?.events.includes(event.id) === true ||
              hovered?.relatedEvents.includes(event.id) === true
                ? true
                : false
            }
          />
        </svg>
        <TimelineLabel
          posX={posX + width / 2}
          posY={posY + height / 2}
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
