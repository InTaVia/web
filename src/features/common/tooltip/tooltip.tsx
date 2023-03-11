import { useHoverState } from '@/app/context/hover.context';
import EventTooltipContent from '@/features/common/tooltip/event-tooltip-content';
import { useElementDimensions } from '@/lib/use-element-dimensions';
import { useElementRef } from '@/lib/use-element-ref';

export function Tooltip(): JSX.Element {
  const { hovered } = useHoverState();

  const offset = 15;

  const [element, setElement] = useElementRef();

  const tooltipDimensions = useElementDimensions({ element });

  //const { left, top, content } = useMemo(() => {
  let left = 0;
  let top = 0;

  if (hovered?.clientRect) {
    left = hovered.clientRect.left + offset;
    top = hovered.clientRect.top + offset;
    top = Math.min(
      top,
      window.innerHeight - (tooltipDimensions != null ? tooltipDimensions.height : 0) - offset,
    );
  }

  let content = null;

  if (hovered?.events.length > 0 && hovered.entities.length === 0) {
    //HOVERED EVENT
    content = (
      <EventTooltipContent
        eventIDs={hovered!.events as Array<string>}
        relatedEntitiesIDs={hovered!.relatedEntities}
        ref={setElement}
      />
    );
  }

  if (hovered?.events.length > 0 && hovered.entities.length === 0) {
    //HOVERED ENTITY
    /*  {
      <EventTooltipContent
      entityID={hovered.entities[0] as string}
      relatedEvents={hovered.relatedEvents}
      ref={setElement}
    />;
    } */
  }

  return (
    <div
      style={{
        left: left,
        top: top,
        border: '1px solid gray',
        display: content != null ? 'block' : 'none',
      }}
      className="absolute z-50 rounded-sm bg-white p-1 drop-shadow-md"
    >
      {content}
    </div>
  );
}
