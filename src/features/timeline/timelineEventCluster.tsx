import 'maplibre-gl/dist/maplibre-gl.css';

import type { Entity, Event } from '@intavia/api-client/dist/models';
import type { LegacyRef, MouseEvent } from 'react';
import { forwardRef, useRef, useState } from 'react';

import { useHoverState } from '@/app/context/hover.context';
import { type TimelineType, getTemporalExtent } from '@/features/timeline/timeline';

import BeeSwarm from './beeSwarmTimeCluster';
import PatisserieChart from './patisserieChart';
import { TimelineLabel } from './timelineLabel';

interface ClusterBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

type TimelineEventClusterProps = {
  events: Array<Event>;
  vertical: boolean;
  timeScale: (toBeScaled: Date) => number;
  midOffset: number;
  timeScaleOffset: number;
  entityIndex: number;
  thickness: number;
  showLabels: boolean;
  clusterMode: 'bee' | 'donut' | 'pie';
  mode?: TimelineType;
  diameter?: number;
  fontSize?: number;
  onClickEvent?: (eventID: Event['id']) => void;
  highlightedByVis: never | { entities: Array<Entity['id']>; events: Array<Event['id']> };
  color?: Record<string, string>;
  timeColorScale: (date: Date) => string;
  colorBy: 'entity-identity' | 'event-kind' | 'time';
};

const TimelineEventCluster = forwardRef((props: TimelineEventClusterProps, ref): JSX.Element => {
  const {
    events,
    vertical = false,
    timeScale,
    midOffset,
    timeScaleOffset,
    entityIndex,
    thickness,
    showLabels,
    clusterMode,
    diameter = 14,
    fontSize = 10,
    mode = 'default',
    onClickEvent,
    highlightedByVis,
    color: i_color,
    colorBy = 'event-kind',
    timeColorScale,
  } = props;

  const [hover, setHover] = useState(false);
  const diameterWithStroke = diameter;
  const { hovered, updateHover } = useHoverState();

  const eventIDs = events.map((event: Event) => {
    return event.id;
  });

  let className = 'timeline-event';

  const eventsExtent = getTemporalExtent([events]);

  const eventMidDate = new Date(eventsExtent[0].getTime() + eventsExtent[1].getTime()) / 2;

  const color =
    i_color != null
      ? i_color
      : colorBy === 'time' && timeColorScale != null
      ? timeColorScale(eventMidDate)
      : null;

  const bbox: ClusterBoundingBox = { x: 0, y: 0, width: 0, height: 0 };
  if (vertical) {
    bbox.x = midOffset - diameterWithStroke / 2;
    bbox.y = timeScale(eventsExtent[0]) - timeScaleOffset;
    bbox.width = diameterWithStroke;
    bbox.height = timeScale(eventsExtent[1]) - timeScaleOffset - bbox.y;
  } else {
    bbox.x = timeScale(eventsExtent[0]) - timeScaleOffset;
    bbox.y = midOffset - diameterWithStroke / 2;
    bbox.width = timeScale(eventsExtent[1]) - timeScaleOffset - bbox.x;
    bbox.height = diameterWithStroke;
  }

  const posX = bbox.x + bbox.width / 2;
  const posY = bbox.y + bbox.height / 2;

  const nodeRef = useRef<HTMLDivElement>(null);

  /* const [clusterDimensions, setClusterDimensions] = useState([
    diameterWithStroke,
    diameterWithStroke,
  ]);
 */
  /* useLayoutEffect(() => {
    if (nodeRef.current != null) {
      const { height, width } = nodeRef.current.getBoundingClientRect();
      setClusterDimensions([width, height]);
    }
  }, []); */

  //const clusterNodeWidth = clusterDimensions[0];
  //const clusterNodeHeight = clusterDimensions[1];

  const clusterPosX = posX; // - clusterNodeWidth / 2;
  const clusterPosY = posY; // - clusterNodeHeight / 2;

  const textPosX = clusterPosX; // + clusterNodeWidth / 2;
  const textPosY = clusterPosY; // + clusterNodeHeight / 2;

  className = className + ' hover-animation';

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: bbox.x,
          top: bbox.y,
          width: bbox.width,
          height: bbox.height,
          cursor: 'pointer',
          backgroundColor: 'teal',
          display: hover ? 'block' : 'none',
        }}
        onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
          updateHover({
            entities: [],
            events: eventIDs,
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
      ></div>
      <div
        ref={ref as LegacyRef<HTMLDivElement>}
        style={{
          position: 'absolute',
          left: clusterPosX,
          top: clusterPosY,
          cursor: 'pointer',
          transform: 'translate(-50%, -50%)',
        }}
        className={className}
        onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
          updateHover({
            entities: [],
            events: eventIDs,
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
      >
        {clusterMode === 'bee' ? (
          <BeeSwarm
            ref={nodeRef}
            events={events}
            width={bbox.width}
            height={bbox.height}
            vertical={vertical}
            dotRadius={5}
            onClickEvent={onClickEvent}
            highlightedByVis={highlightedByVis}
            color={color}
          />
        ) : (
          <PatisserieChart
            ref={nodeRef}
            events={events}
            diameter={diameterWithStroke}
            patisserieType={clusterMode}
            highlightedByVis={highlightedByVis}
            color={color}
            // hover={hover || hovered?.events.includes(event.id) === true ? true : false}
          />
        )}
        <TimelineLabel
          posX={textPosX}
          posY={textPosY}
          labelText={`${events.length} Events`}
          showLabels={showLabels}
          entityIndex={entityIndex}
          thickness={thickness}
          vertical={vertical}
          mode={mode}
          fontSize={fontSize}
        />
      </div>
    </>
  );
});

TimelineEventCluster.displayName = 'TimelineEventCluster';

export default TimelineEventCluster;
