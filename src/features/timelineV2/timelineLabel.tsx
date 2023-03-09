import 'maplibre-gl/dist/maplibre-gl.css';

import type { TimelineType } from '@/features/timelineV2/timeline';

interface TimelineLabelProps {
  posX: number;
  posY: number;
  labelText: string;
  vertical?: boolean;
  hover?: boolean;
  thickness?: number;
  mode?: TimelineType;
  entityIndex?: number;
  fontSize?: number;
  showLabels?: boolean;
}

export function TimelineLabel(props: TimelineLabelProps): JSX.Element {
  const {
    posX,
    posY,
    labelText,
    vertical = false,
    hover = false,
    thickness = 1,
    mode = 'default',
    showLabels = false,
    entityIndex = 0,
    fontSize = 10,
  } = props;

  const textHeight = hover ? 12 : 10;
  const diameter = (hover ? 10 + thickness : 7 + thickness) * 2;

  const textOffset = diameter + fontSize;
  let textAngle = 45;
  let textTranslateStr = '';
  let textTranslateStrAfter = '';
  let marginLeft = textOffset;
  let marginRight = 0;

  if (vertical) {
    if (mode === 'dual') {
      if (entityIndex === 1) {
        textAngle = -45;
        textTranslateStrAfter = 'translateX(-100%)';
        marginLeft = 0;
        marginRight = textOffset;
      }
    }
  } else {
    if (mode === 'dual') {
      if (entityIndex === 1) {
        textAngle = -45;
      }
    } else {
      textAngle = -45;
    }
    textTranslateStr = `translate(${textOffset}px, ${-textOffset}px)`;
  }

  return (
    <>
      <div
        style={{
          padding: '0 2px',
          backgroundColor: 'white',
          borderRadius: '2px',
          position: 'absolute',
          left: posX,
          top: posY,
          fontSize: `${fontSize}px`,
          maxWidth: '12em',
          transformOrigin: 'left bottom',
          transform: `${textTranslateStr} rotate(${textAngle}deg) ${textTranslateStrAfter}`.trim(),
        }}
        className={`timelineLabel ${
          showLabels || hover ? 'visible' : 'invisible'
        } overflow-hidden text-ellipsis whitespace-nowrap`}
      >
        {labelText}
      </div>
    </>
  );
}
