import { CursorClickIcon, PlusSmIcon } from '@heroicons/react/outline';
import type { Entity } from '@intavia/api-client';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@intavia/ui';
import type { DragEvent, ReactNode } from 'react';
import { useState } from 'react';

import { useHoverState } from '@/app/context/hover.context';
import { useLocale } from '@/app/route/use-locale';
import { useAppSelector } from '@/app/store';
import { selectEvents, selectVocabularyEntries } from '@/app/store/intavia.slice';
import type { DataTransferData } from '@/features/common/data-transfer.types';
import { type as mediaType } from '@/features/common/data-transfer.types';
import { getTranslatedLabel } from '@/lib/get-translated-label';

interface EntityItemProps {
  entity: Entity;
  icon?: ReactNode;
}
export function EntityItem(props: EntityItemProps): JSX.Element {
  const { entity, icon = null } = props;

  const [isHovered, setIsHovered] = useState<boolean>(false);
  const { hovered, updateHover } = useHoverState();

  const { locale } = useLocale();
  const _events = useAppSelector(selectEvents);
  const vocabularies = useAppSelector(selectVocabularyEntries);

  function onDragStart(event: DragEvent<HTMLDivElement>) {
    const data: DataTransferData = { type: 'data', entities: [entity.id], events: [] };
    event.dataTransfer.setData(mediaType, JSON.stringify(data));
  }

  function onMouseEnter(e) {
    updateHover({
      entities: [entity.id],
      events: [],
      clientRect: {
        left: e.clientX,
        top: e.clientY,
      } as DOMRect,
    });
    setIsHovered(true);
    //update workspace hovered
  }

  function onMouseLeave() {
    updateHover(null);
    setIsHovered(false);
    //update workspace hovered
  }

  return (
    <div className="grid border border-neutral-200">
      <Collapsible>
        <CollapsibleTrigger
          as="div"
          className="flex w-full flex-row items-center justify-between px-2 py-1 text-left hover:bg-neutral-200"
          draggable
          onDragStart={onDragStart}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="flex flex-row items-center gap-2">
            <div className="min-w-fit text-neutral-400">{icon}</div>
            {entity.label != null && getTranslatedLabel(entity.label)}
          </div>
          {isHovered && <CursorClickIcon className="h-4 w-4 text-neutral-400" />}
          <div className="min-w-fit">
            <PlusSmIcon className="h-4 w-4 text-neutral-500" />
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <ul className="grid gap-2 text-sm" role="list">
            {entity.relations != null &&
              entity.relations.map((relation) => {
                const eventId = relation.event;
                const event = _events[eventId];
                if (event == null) return null;

                function onDragStart(event: DragEvent<HTMLDivElement>) {
                  const data: DataTransferData = {
                    type: 'data',
                    entities: [],
                    events: [eventId],
                    targetEntities: [entity.id],
                  };
                  event.dataTransfer.setData(mediaType, JSON.stringify(data));
                }

                // // FIXME:
                // const place =
                //   typeof entityEvent.place === 'string'
                //     ? _entities[entityEvent.place]
                //     : entityEvent.place;

                return (
                  <li key={`${eventId}-${relation.role}`}>
                    <div className="cursor-default" draggable onDragStart={onDragStart}>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-neutral-500">
                          {[event.startDate, event.endDate].filter(Boolean).join(' - ')}
                        </p>
                        <p>{getTranslatedLabel(event.label, locale)}</p>
                        <div className="text-xs text-neutral-500">
                          {[
                            vocabularies[event.kind] != null && 'label' in vocabularies[event.kind]
                              ? getTranslatedLabel(vocabularies[event.kind].label)
                              : null,
                            // [event.startDate, event.endDate].filter(Boolean).join(' - '),
                            // place != null ? getTranslatedLabel(place.label) : null,
                          ]
                            .filter(Boolean)
                            .join(', ')}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
