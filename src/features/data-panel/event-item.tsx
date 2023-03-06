import { CursorClickIcon, PlusSmIcon } from '@heroicons/react/outline';
import type { Event } from '@intavia/api-client';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@intavia/ui';
import type { DragEvent, ReactNode } from 'react';
import { useState } from 'react';

import { useHoverState } from '@/app/context/hover.context';
import { useLocale } from '@/app/route/use-locale';
import { useAppSelector } from '@/app/store';
import { selectEntities, selectVocabularyEntries } from '@/app/store/intavia.slice';
import type { DataTransferData } from '@/features/common/data-transfer.types';
import { type as mediaType } from '@/features/common/data-transfer.types';
import { EntityKindIcon } from '@/features/common/entity-kind-icon';
import { getColorsById } from '@/features/common/visualization.config';
import { getTranslatedLabel } from '@/lib/get-translated-label';

interface EventItemProps {
  event: Event;
  icon?: ReactNode;
}
export function EventItem(props: EventItemProps): JSX.Element {
  const { event, icon = null } = props;

  const [isHovered, setIsHovered] = useState<boolean>(false);
  const { hovered, updateHover } = useHoverState();

  const { locale } = useLocale();
  const _entities = useAppSelector(selectEntities);
  const vocabularies = useAppSelector(selectVocabularyEntries);

  const hoverColor = getColorsById(event.kind).foreground;

  function onDragStart(dragEvent: DragEvent<HTMLDivElement>) {
    const data: DataTransferData = { type: 'data', entities: [], events: [event.id] };
    dragEvent.dataTransfer.setData(mediaType, JSON.stringify(data));
  }

  function onMouseEnter() {
    updateHover({ entities: [], events: [event.id], clientRect: null });
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
          className={`flex w-full flex-row items-center justify-between px-2 py-1 text-left hover:bg-slate-200`}
          draggable
          onDragStart={onDragStart}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="flex flex-row items-center gap-1">
            <div className="min-w-fit text-slate-400">{icon}</div>
            <p className="text-xs text-slate-500">
              {[event.startDate, event.endDate].filter(Boolean).join(' - ')}
            </p>
            <p>{getTranslatedLabel(event.label)}</p>
          </div>
          {isHovered && <CursorClickIcon className="h-4 w-4 text-slate-400" />}
          <div className="min-w-fit">
            <PlusSmIcon className="h-4 w-4 text-slate-500" />
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <ul className="grid gap-1 text-sm" role="list">
            {event.relations != null &&
              event.relations.map((relation) => {
                const entityId = relation.entity;
                const entity = _entities[entityId];
                if (entity == null) return null;

                function onDragStart(event: DragEvent<HTMLDivElement>) {
                  const data: DataTransferData = {
                    type: 'data',
                    entities: [entityId],
                    events: [],
                  };
                  event.dataTransfer.setData(mediaType, JSON.stringify(data));
                }

                // // FIXME:
                // const place =
                //   typeof entityEvent.place === 'string'
                //     ? _entities[entityEvent.place]
                //     : entityEvent.place;

                return (
                  <li key={`${entityId}-${relation.role}`}>
                    <div className="cursor-default" draggable onDragStart={onDragStart}>
                      <div className="flex h-fit flex-row items-center gap-2 text-xs text-neutral-500">
                        <div className="min-w-fit">
                          <EntityKindIcon kind={entity.kind} />
                        </div>
                        <p>{getTranslatedLabel(entity.label, locale)}</p>
                        <p>
                          {[
                            `(${
                              vocabularies[relation.role] != null
                                ? getTranslatedLabel(vocabularies[relation.role].label)
                                : null
                            })`,
                            // [event.startDate, event.endDate].filter(Boolean).join(' - '),
                            // place != null ? getTranslatedLabel(place.label) : null,
                          ]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
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
