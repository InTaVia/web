import 'maplibre-gl/dist/maplibre-gl.css';

import type { TimelineType } from '@/features/timeline/timeline';

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
  selected?: boolean;
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
    selected = false,
  } = props;

  const textHeight = hover ? fontSize + 2 : fontSize;
  const diameter = (hover ? fontSize + thickness : 7 + thickness) * 2;

  const textOffset = fontSize + 5;
  let textAngle = 45;
  const textTranslateStr = '';
  let textTranslateStrAfter = '';
  let marginLeft = textOffset;
  let marginRight = 0;

  let top: number | string = 0;
  let left: number | string = 0;

  if (vertical) {
    if (mode === 'dual') {
      if (entityIndex === 1) {
        textAngle = -45;
        textTranslateStrAfter = 'translateX(-100%)';
        marginLeft = 0;
        marginRight = textOffset;
      }
    } else if (mode === 'single') {
      textAngle = 0;
      //textTranslateStr = `translate(${textOffset}px, -50%)`;
      left = `calc(100% + ${fontSize}px)`;
      top = '50%';
      textTranslateStrAfter = 'translateY(-50%)';
    } else {
      left = `calc(100% + 5px)`;
      top = '50%';
      textTranslateStrAfter = 'translateY(-50%)';
    }
  } else {
    textAngle = -45;
    top = -textOffset;
    left = '50%';
    if (mode === 'dual') {
      if (entityIndex === 0) {
        textAngle = 45;
        top = '100%';
      }
    }
    //textTranslateStr = `translate(50%, ${-textOffset}px)`;
  }

  return (
    <>
      <div
        style={{
          padding: '0 2px',
          backgroundColor: 'white',
          borderRadius: '2px',
          position: 'absolute',
          left: left,
          top: top,
          fontSize: `${fontSize}px`,
          maxWidth: mode === 'single' ? 'unset' : '12em',
          transformOrigin: 'left center',
          transform: `rotate(${textAngle}deg) ${textTranslateStrAfter}`.trim(),
          //transform: `rotate(${textAngle}deg)`.trim(),
          fontWeight: selected ? 'bold' : 'default',
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
