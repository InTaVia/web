import 'maplibre-gl/dist/maplibre-gl.css';

import type { EntityRelationRole, Event } from '@intavia/api-client/dist/models';
import { forwardRef, useState } from 'react';

import { useAppSelector } from '@/app/store';
import { selectVocabularyEntries } from '@/app/store/intavia.slice';
import {
  type TimelineType,
  getTemporalExtent,
  translateEventType,
} from '@/features/timelineV2/timeline';

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
    thickness = 1,
    showLabels,
    overlapIndex,
    overlap = false,
    mode = 'default',
    diameter = 16,
  } = props;

  const vocabularies = useAppSelector(selectVocabularyEntries);

  const [hover, setHover] = useState(false);

  const eventExtent = getTemporalExtent([[event]]);
  const extentDiffInYears = eventExtent[1].getUTCFullYear() - eventExtent[0].getUTCFullYear();

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

  const type = translateEventType(
    vocabularies[event.kind],
    roles
      .map((roleId) => {
        return vocabularies[roleId];
      })
      .filter((entry) => {
        return entry !== undefined;
      }),
  );

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
        onMouseEnter={() => {
          setHover(true);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
      >
        <svg style={{ width: `${width}px`, height: `${height}px` }} width={width} height={height}>
          <TimelineEventMarker width={width} height={height} type={type} thickness={thickness} />
        </svg>
      </div>
      <TimelineLabel
        posX={posX + width / 2}
        posY={posY + height / 2}
        labelText={event.label.default}
        showLabels={showLabels}
        entityIndex={entityIndex}
        mode={mode}
        thickness={thickness}
        vertical={vertical}
      />
    </>
  );
});

TimelineEvent.displayName = 'TimelineEvent';
export default TimelineEvent;