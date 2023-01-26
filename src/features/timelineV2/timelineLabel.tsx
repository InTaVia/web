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
  } = props;

  const textHeight = hover ? 12 : 10;
  const diameter = (hover ? 10 + thickness : 7 + thickness) * 2;

  const textOffset = diameter;
  let textAngle = 45;
  let textTranslateStr = '';
  let marginLeft = textOffset;
  let marginRight = 0;

  if (vertical) {
    if (mode === 'dual') {
      if (entityIndex === 1) {
        textAngle = -45;
        textTranslateStr = 'translateX(-100%)';
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
  }

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: posX,
          top: posY,
          fontSize: `${textHeight}px`,
          width: 'max-content',
          transformOrigin: 'left',
          transform: `rotate(${textAngle}deg) ${textTranslateStr}`.trim(),
          fontWeight: hover ? 'bold' : 'unset',
          zIndex: hover ? 9999 : 'unset',
          marginTop: `${-5}px`,
        }}
        className={`timelineLabel ${showLabels || hover ? 'visible' : 'invisible'}`}
      >
        <div
          style={{
            marginLeft: `${marginLeft}px`,
            marginRight: `${marginRight}px`,
            backgroundColor: 'white',
          }}
        >
          {labelText}
        </div>
      </div>
    </>
  );
}
