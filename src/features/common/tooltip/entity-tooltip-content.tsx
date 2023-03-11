import type { Entity, Event } from '@intavia/api-client';
import type { LegacyRef } from 'react';
import { forwardRef } from 'react';

import { useLocale } from '@/app/route/use-locale';
import { useAppSelector } from '@/app/store';
import { selectEntities, selectEvents } from '@/app/store/intavia.slice';
import { EntityKindIcon } from '@/features/common/entity-kind-icon';
import { MediaThumbnail } from '@/features/common/tooltip/tooltip';
import { getTranslatedLabel } from '@/lib/get-translated-label';

interface EntityTooltipContentProps {
  entityIDs: Array<Entity['id']>;
  relatedEventIDs?: Array<Event['id']>;
}

const entityKindSorting: Record<Entity['kind'], number> = {
  person: 1,
  'cultural-heritage-object': 2,
  'historical-event': 3,
  group: 4,
  place: 5,
};

const EntityTooltipContent = forwardRef(
  (props: EntityTooltipContentProps, ref: unknown): JSX.Element => {
    const { entityIDs, relatedEventIDs = [] } = props;

    const { locale } = useLocale();

    const _events = useAppSelector(selectEvents);
    const _entities = useAppSelector(selectEntities);

    const entitiesWithMedia: Array<Entity['id']> = [];

    const entities = Object.fromEntries(
      entityIDs
        .filter((key) => {
          return key in _entities;
        })
        .map((key) => {
          if (_entities[key].media != null) {
            entitiesWithMedia.push(key);
          }
          return [key, _entities[key]];
        }),
    ) as Record<Entity['id'], Entity>;

    const relatedEvents = Object.fromEntries(
      relatedEventIDs
        .filter((key) => {
          return key in _events;
        })
        .map((key) => {
          return [key, _events[key]];
        }),
    ) as Record<Event['id'], Event>;

    const sortedEntities = Object.values(entities).sort((entityA, entityB) => {
      return entityKindSorting[entityA!.kind] - entityKindSorting[entityB!.kind];
    });

    return (
      <div ref={ref as LegacyRef<HTMLDivElement>}>
        {/*  {Object.values(entities).length < 6 ? (
          Object.values(entities).map((entity) => {
            return <div key={`entity${entity!.id}`}>- {getTranslatedLabel(entity!.label)}</div>;
          })
        ) : (
          <b>{Object.values(entities).length} Entities</b>
        )} */}
        {sortedEntities.length < 6 ? (
          sortedEntities.map((entity) => {
            return (
              <>
                <div className="flex h-fit flex-row items-center gap-2 text-xs">
                  <div className="min-w-fit">
                    <EntityKindIcon kind={entity.kind} />
                  </div>
                  <p>{getTranslatedLabel(entity.label, locale)}</p>
                </div>
                {/* {relatedEntitiesWithMedia.includes(entity.id) && <img className="h-10" src={"TEST"} />} */}
                {entitiesWithMedia.includes(entity.id) && (
                  <div className="h-40">
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

EntityTooltipContent.displayName = 'EntityTooltipContent';
export default EntityTooltipContent;
