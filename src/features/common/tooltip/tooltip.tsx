import type { MediaResource } from '@intavia/api-client';
import { LoadingIndicator } from '@intavia/ui';

import { useHoverState } from '@/app/context/hover.context';
import EntityTooltipContent from '@/features/common/tooltip/entity-tooltip-content';
import EventTooltipContent from '@/features/common/tooltip/event-tooltip-content';
import { useMediaResources } from '@/features/media/use-media-resources';
import { useElementDimensions } from '@/lib/use-element-dimensions';
import { useElementRef } from '@/lib/use-element-ref';

interface MediaThumbnailProps {
  mediaResourceId: MediaResource['id'];
}

export function MediaThumbnail(props: MediaThumbnailProps): JSX.Element {
  const { mediaResourceId } = props;

  const { data, status } = useMediaResources([mediaResourceId]);

  const mediaResource = data.get(mediaResourceId);

  if (status === 'success') {
    return <img className="h-full w-auto" alt={mediaResource?.id} src={mediaResource?.url} />;
  }

  return (
    <div className="grid h-full w-full place-items-center bg-neutral-50">
      <LoadingIndicator />
    </div>
  );
}

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
      screen.innerHeight - (tooltipDimensions != null ? tooltipDimensions.height : 0) - offset,
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

  if (hovered?.events.length === 0 && hovered.entities.length > 0) {
    //HOVERED ENTITY
    content = (
      <EntityTooltipContent
        entityIDs={hovered!.entities as Array<string>}
        relatedEventIDs={hovered!.relatedEvents}
        ref={setElement}
      />
    );
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
