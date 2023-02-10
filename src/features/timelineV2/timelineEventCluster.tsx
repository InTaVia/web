import 'maplibre-gl/dist/maplibre-gl.css';

import type { Event } from '@intavia/api-client/dist/models';
import { type LegacyRef, forwardRef, useRef, useState } from 'react';

import { type TimelineType, getTemporalExtent } from '@/features/timelineV2/timeline';

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
    mode = 'default',
  } = props;

  const [hover, setHover] = useState(false);
  const diameterWithStroke = diameter + thickness;

  let className = 'timeline-event';

  const eventsExtent = getTemporalExtent([events]);

  const bbox: ClusterBoundingBox = { x: 0, y: 0, width: 0, height: 0 };
  if (vertical) {
    bbox.x = midOffset + Math.floor(thickness / 2) - diameterWithStroke / 2;
    bbox.y = timeScale(eventsExtent[0]) - timeScaleOffset;
    bbox.width = diameterWithStroke;
    bbox.height = timeScale(eventsExtent[1]) - timeScaleOffset - bbox.y;
  } else {
    bbox.x = timeScale(eventsExtent[0]) - timeScaleOffset;
    bbox.y = midOffset + Math.floor(thickness / 2) - diameterWithStroke / 2;
    bbox.width = timeScale(eventsExtent[1]) - timeScaleOffset - bbox.x;
    bbox.height = diameterWithStroke;
  }

  const posX = bbox.x + bbox.width / 2;
  const posY = bbox.y + bbox.height / 2;

  const nodeRef = useRef<HTMLDivElement>(null);

  const clusterNodeHeight = nodeRef.current ? nodeRef.current.clientHeight : 0;

  const clusterNodeWidth = nodeRef.current ? nodeRef.current.clientWidth : 0;

  const clusterPosX = posX - clusterNodeWidth / 2;
  const clusterPosY = posY - clusterNodeHeight / 2;

  const textPosX = clusterPosX + clusterNodeWidth / 2;
  const textPosY = clusterPosY + clusterNodeHeight / 2;

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
        onMouseEnter={() => {
          setHover(true);
        }}
        onMouseLeave={() => {
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
        }}
        className={className}
        onMouseEnter={() => {
          setHover(true);
        }}
        onMouseLeave={() => {
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
            dotRadius={diameterWithStroke / 3}
          />
        ) : (
          <PatisserieChart
            ref={nodeRef}
            events={events}
            diameter={diameterWithStroke}
            patisserieType={clusterMode}
          />
        )}
      </div>
      <TimelineLabel
        posX={textPosX}
        posY={textPosY}
        labelText={`${events.length} Events`}
        showLabels={showLabels}
        entityIndex={entityIndex}
        thickness={thickness}
        vertical={vertical}
        mode={mode}
      />
    </>
  );
});

TimelineEventCluster.displayName = 'TimelineEventCluster';

export default TimelineEventCluster;
