import { type MouseEvent, useContext } from 'react';

import { useHoverState } from '@/app/context/hover.context';
import { PageContext } from '@/app/context/page.context';

interface DotGElementProps {
  id: string;
  shape: 'dot' | 'ellipse' | 'rectangle' | 'triangle';
  shapeProperties: Record<string, number | string>;
  onToggleSelection?: (ids: Array<string>) => void;
}

export function DotGElement(props: DotGElementProps): JSX.Element {
  const { id, shape, shapeProperties, onToggleSelection } = props;

  const pageContext = useContext(PageContext);
  const { updateHover } = useHoverState();

  function onClick() {
    if (pageContext.page === 'story-creator') {
      onToggleSelection?.([id as string]);
    }
  }

  return (
    <g
      onMouseEnter={(event: MouseEvent<SVGGElement>) => {
        updateHover({
          entities: [],
          events: [id],
          clientRect: {
            left: event.clientX,
            top: event.clientY,
          } as DOMRect,
          pageRect: { left: event.pageX, top: event.pageY } as DOMRect,
        });
      }}
      onMouseLeave={() => {
        updateHover(null);
      }}
      onClick={onClick}
    >
      {shape === 'rectangle' ? <rect {...shapeProperties} /> : <circle {...shapeProperties} />}
    </g>
  );
}
