import 'maplibre-gl/dist/maplibre-gl.css';

import { forwardRef } from 'react';

import { useAppSelector } from '@/app/store';
import { selectVocabularyEntries } from '@/app/store/intavia.slice';
import { getEventKindPropertiesById, highlight } from '@/features/common/visualization.config';
import { getTranslatedLabel } from '@/lib/get-translated-label';

interface TimelineEventMarkerProps {
  width: number;
  height: number;
  thickness: number;
  hover: boolean;
  selected?: boolean;
  color?: string;
  shape?: string;
}

const TimelineEventMarker = forwardRef((props: TimelineEventMarkerProps, ref): JSX.Element => {
  const {
    width,
    height,
    thickness,
    hover = false,
    shape,
    color: i_color,
    selected = false,
  } = props;

  const strokeWidth = thickness;

  const color = i_color != null ? i_color : { main: 'gray', dark: 'black' };

  switch (shape) {
    case 'dot':
      return (
        <circle
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          ref={ref}
          cx={width / 2}
          cy={height / 2}
          r={(width - strokeWidth) / 2}
          fill={hover ? color.dark : color.main}
          stroke={hover ? color.main : selected ? highlight.color : color.dark}
          strokeWidth={strokeWidth}
        />
      );
    case 'rectangle':
      return (
        <rect
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          ref={ref}
          x={thickness / 2}
          y={thickness / 2}
          width={width - thickness}
          height={height - thickness}
          fill={hover ? color.dark : color.main}
          stroke={hover ? color.main : selected ? highlight.color : color.dark}
          strokeWidth={strokeWidth}
        />
      );
  }
});
/*  */

TimelineEventMarker.displayName = 'TimelineEventMarker';

export default TimelineEventMarker;
