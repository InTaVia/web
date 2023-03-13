import type { Entity, Event } from '@intavia/api-client';
import type { LegacyRef } from 'react';
import { forwardRef } from 'react';

import { useLocale } from '@/app/route/use-locale';
import { useAppSelector } from '@/app/store';
import { selectEntities, selectEvents } from '@/app/store/intavia.slice';
import { EntityKindIcon } from '@/features/common/entity-kind-icon';
import { MediaThumbnail } from '@/features/common/tooltip/tooltip';
import { getTranslatedLabel } from '@/lib/get-translated-label';

interface EventTooltipContentProps {
  eventIDs: Array<Event['id']>;
  relatedEntitiesIDs?: Array<Entity['id']>;
}

const entityKindSorting: Record<Entity['kind'], number> = {
  person: 1,
  'cultural-heritage-object': 2,
  'historical-event': 3,
  group: 4,
  place: 5,
};

const EventTooltipContent = forwardRef(
  (props: EventTooltipContentProps, ref: unknown): JSX.Element => {
    const { eventIDs, relatedEntitiesIDs = [] } = props;

    const { locale } = useLocale();

    const _events = useAppSelector(selectEvents);
    const _entities = useAppSelector(selectEntities);

    const events = Object.fromEntries(
      eventIDs
        .filter((key) => {
          return key in _events;
        })
        .map((key) => {
          return [key, _events[key]];
        }),
    );

    const relatedEntitiesWithMedia: Array<Entity['id']> = [];

    const relatedEntities = Object.fromEntries(
      relatedEntitiesIDs
        .filter((key) => {
          return key in _entities;
        })
        .map((key) => {
          if (_entities[key].media != null) {
            relatedEntitiesWithMedia.push(key);
          }
          return [key, _entities[key]];
        }),
    ) as Record<Entity['id'], Entity>;

    const sortedEntities = Object.values(relatedEntities).sort((entityA, entityB) => {
      return entityKindSorting[entityA!.kind] - entityKindSorting[entityB!.kind];
    });

    return (
      <div ref={ref as LegacyRef<HTMLDivElement>}>
        {Object.values(events).length < 6 ? (
          Object.values(events).map((event) => {
            return <div key={`event${event!.id}`}>- {getTranslatedLabel(event!.label)}</div>;
          })
        ) : (
          <b>{Object.values(events).length} Events</b>
        )}
        {sortedEntities.length < 6 ? (
          sortedEntities.map((entity) => {
            return (
              <>
                <div
                  className="flex h-fit flex-row items-center gap-2 text-xs text-neutral-500"
                  key={`entityTootlipEntryEvent${entity.id}`}
                >
                  <div className="min-w-fit">
                    <EntityKindIcon kind={entity.kind} />
                  </div>
                  <p>{getTranslatedLabel(entity.label, locale)}</p>
                </div>
                {/* {relatedEntitiesWithMedia.includes(entity.id) && <img className="h-10" src={"TEST"} />} */}
                {relatedEntitiesWithMedia.includes(entity.id) && (
                  <div className="ml-3 h-40">
                    <MediaThumbnail mediaResourceId={entity!.media[0]} />
                  </div>
                )}
              </>
            );
          })
        ) : (
          <div className="ml-2">{sortedEntities.length} Related Entities</div>
        )}
      </div>
    );
  },
);

EventTooltipContent.displayName = 'EventTooltipContent';
export default EventTooltipContent;
