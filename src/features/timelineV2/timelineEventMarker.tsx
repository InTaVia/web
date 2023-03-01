import 'maplibre-gl/dist/maplibre-gl.css';

import { forwardRef } from 'react';

import { getEventKindPropertiesByType } from '@/features/common/visualization.config';
import { TimelineColors } from '@/features/timelineV2/timeline';

interface TimelineEventMarkerProps {
  width: number;
  height: number;
  type?: 'birth' | 'creation' | 'death' | 'personplace';
  thickness: number;
  hover: boolean;
}

const TimelineEventMarker = forwardRef((props: TimelineEventMarkerProps, ref): JSX.Element => {
  const { width, height, type = '', thickness, hover = false } = props;

  const strokeWidth = 512 / (width / thickness);
  const scale = (width - thickness) / 512;

  const color = getEventKindPropertiesByType(type).color;

  switch (type) {
    case 'birth':
    case 'death':
      return (
        <circle
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          ref={ref}
          cx={width / 2}
          cy={height / 2}
          r={(width - thickness) / 2}
          fill={hover ? color.foreground : color.background}
          stroke={hover ? color.background : 'black'}
          strokeWidth={thickness}
        />
      );
    case 'personplace':
      return (
        <g
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          ref={ref}
          transform={`translate(${thickness / 2} ${thickness / 2}) scale(${scale})`}
        >
          <path
            fill={hover ? color.foreground : color.background}
            stroke={hover ? color.background : 'black'}
            strokeWidth={strokeWidth}
            d="M 256,0 C 170.3,0 100.8,68.2 100.8,152.2 100.8,236.3 256,512 256,512 256,512 411.2,236.3 411.2,152.2 411.2,68.2 341.7,0 256,0 Z"
          />
        </g>
      );
    case 'creation':
      return (
        <rect
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          ref={ref}
          x={thickness / 2}
          y={thickness / 2}
          width={width - thickness}
          height={height - thickness}
          fill={hover ? color.foreground : color.background}
          stroke={hover ? color.background : 'black'}
          strokeWidth={thickness}
        />
      );
    default:
      return (
        <circle
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          ref={ref}
          cx={width / 2}
          cy={height / 2}
          r={(width - thickness) / 2}
          fill={hover ? color.foreground : color.background}
          stroke={hover ? color.background : 'black'}
          strokeWidth={thickness}
        />
      );
  }
});
/*  */

TimelineEventMarker.displayName = 'TimelineEventMarker';

export default TimelineEventMarker;
