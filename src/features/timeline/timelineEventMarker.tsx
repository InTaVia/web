import 'maplibre-gl/dist/maplibre-gl.css';

import { forwardRef } from 'react';

import { useAppSelector } from '@/app/store';
import { selectVocabularyEntries } from '@/app/store/intavia.slice';
import { getEventKindPropertiesById, highlight } from '@/features/common/visualization.config';
import { getTranslatedLabel } from '@/lib/get-translated-label';

interface TimelineEventMarkerProps {
  event: Event;
  width: number;
  height: number;
  thickness: number;
  hover: boolean;
  selected?: boolean;
  color?: string;
}

const TimelineEventMarker = forwardRef((props: TimelineEventMarkerProps, ref): JSX.Element => {
  const {
    width,
    height,
    thickness,
    hover = false,
    event,
    color: i_color,
    selected = false,
  } = props;

  const vocabularies = useAppSelector(selectVocabularyEntries);
  event.kind in vocabularies ? getTranslatedLabel(vocabularies[event.kind].label) : event.kind;
  const {
    color: eventKindColor,
    shape,
    strokeWidth: eventKindStrokeWidth,
  } = getEventKindPropertiesById(event.kind);

  const color = i_color !== undefined ? i_color : eventKindColor;

  const selectedStrokeWidth = 3;
  const hoverStrokeWidth = 2.5;

  const strokeWidth = selected
    ? selectedStrokeWidth
    : hover
    ? hoverStrokeWidth
    : eventKindStrokeWidth;

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
          stroke={selected ? highlight.color : color.dark}
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
          stroke={selected ? highlight.color : color.dark}
          strokeWidth={strokeWidth}
        />
      );
  }
});
/*  */

TimelineEventMarker.displayName = 'TimelineEventMarker';

export default TimelineEventMarker;
