import 'maplibre-gl/dist/maplibre-gl.css';

import { forwardRef } from 'react';

import { TimelineColors } from '@/features/timelineV2/timeline';

interface TimelineEventMarkerProps {
  width: number;
  height: number;
  type?: 'birth' | 'death' | 'personplace';
  thickness: number;
}

const TimelineEventMarker = forwardRef((props: TimelineEventMarkerProps, ref): JSX.Element => {
  const { width, height, type = '', thickness } = props;

  const strokeWidth = 512 / (width / thickness);
  const scale = (width - thickness) / 512;

  const color = TimelineColors[type] ?? 'teal';

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
          fill={color}
          stroke="black"
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
            fill={color}
            stroke="black"
            strokeWidth={strokeWidth}
            d="M 256,0 C 170.3,0 100.8,68.2 100.8,152.2 100.8,236.3 256,512 256,512 256,512 411.2,236.3 411.2,152.2 411.2,68.2 341.7,0 256,0 Z"
          />
        </g>
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
        fill={color}
        stroke="black"
        strokeWidth={thickness}
      />
        // <rect
        //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //   //@ts-ignore
        //   ref={ref}
        //   x={thickness / 2}
        //   y={thickness / 2}
        //   width={width - thickness}
        //   height={height - thickness}
        //   fill={color}
        //   stroke="black"
        //   strokeWidth={thickness}
        // />
      );
  }
});
/*  */

TimelineEventMarker.displayName = 'TimelineEventMarker';

export default TimelineEventMarker;
