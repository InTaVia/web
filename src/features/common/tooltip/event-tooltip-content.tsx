import type { Entity, Event } from '@intavia/api-client';
import type { LegacyRef } from 'react';
import { forwardRef } from 'react';

import { useAppSelector } from '@/app/store';
import { selectEntities, selectEvents } from '@/app/store/intavia.slice';
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

    const relatedEntities = Object.fromEntries(
      relatedEntitiesIDs
        .filter((key) => {
          return key in _entities;
        })
        .map((key) => {
          return [key, _entities[key]];
        }),
    );

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
              <div className="ml-3 text-gray-500" key={`relatedEntity${entity!.id}`}>
                {getTranslatedLabel(entity!.label)} ({entity!.kind})
              </div>
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
