import type { ReactNode } from 'react';
import { useMemo } from 'react';

import type { TimelineType } from '@/features/timeline/timeline';

export interface TimelineEntityLabelProps {
  children: ReactNode;
  vertical?: boolean;
  lineHeight?: number;
  mode?: TimelineType;
  entityIndex?: number;
}

export function TimelineEntityLabel(props: TimelineEntityLabelProps): JSX.Element {
  const { children, vertical = false, lineHeight = 12, mode = 'default', entityIndex = 0 } = props;

  const { marginTop, marginLeft } = useMemo(() => {
    let marginTop = 0;
    let marginLeft = 0;
    if (vertical) {
      marginTop = 0;
      if (mode !== 'mass') {
        if (mode === 'dual' && entityIndex === 1) {
          marginLeft = lineHeight;
        } else {
          marginLeft = -lineHeight - 9;
        }
      }
    } else {
      if (mode !== 'mass') {
        if (mode === 'dual' && entityIndex === 0) {
          marginTop = -lineHeight - 12;
        } else {
          marginTop = 12;
        }
      }
    }
    return { marginTop, marginLeft };
  }, [vertical, lineHeight, entityIndex, mode]);

  return (
    <div
      style={{
        width: '100%',
        minWidth: vertical ? '1em' : '120px',
        minHeight: vertical ? '120px' : '1em',
        paddingLeft: vertical ? 0 : '5px',
        paddingTop: vertical ? '5px' : 0,
        lineHeight: `${lineHeight}px`,
        fontSize: `${lineHeight}px`,
        writingMode: vertical ? 'vertical-rl' : '',
        textOrientation: vertical ? 'mixed' : '',
        marginTop: `${marginTop}px`,
        marginLeft: `${marginLeft}px`,
      }}
      className="overflow-hidden text-ellipsis whitespace-nowrap"
    >
      {children}
    </div>
  );
}
