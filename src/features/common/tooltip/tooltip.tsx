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

  if (hovered?.clientRect && hovered.pageRect) {
    left = hovered.clientRect.left + offset;

    if (tooltipDimensions != null) {
      if (hovered.clientRect.top + tooltipDimensions.height > window.innerHeight) {
        const diff = hovered.clientRect.top + tooltipDimensions.height - window.innerHeight;
        top = hovered.pageRect.top - diff - offset;
      } else {
        top = hovered.pageRect.top + offset;
      }
    } else {
      top = hovered.pageRect.top + offset;
    }

    if (tooltipDimensions != null) {
      if (hovered.clientRect.left + tooltipDimensions.width > window.innerWidth) {
        left = hovered.pageRect.left - tooltipDimensions.width - 2 * offset;
      } else {
        left = hovered.pageRect.left + offset;
      }
    } else {
      left = hovered.pageRect.left + offset;
    }
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
    <>
      {content != null && (
        <div
          id="tooltipWrapper"
          style={{
            left: left,
            top: top,
            border: '1px solid gray',
            visibility: 'visible',
          }}
          className="absolute z-50 rounded-sm bg-white p-1 drop-shadow-md"
        >
          {content}
        </div>
      )}
    </>
  );
}
