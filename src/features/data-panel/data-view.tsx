import type { Entity, EntityKind, Event } from '@intavia/api-client';
import { ScrollArea } from '@intavia/ui';
import { useMemo } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { EntityKindIcon } from '@/features/common/entity-kind-icon';
import type { Visualization } from '@/features/common/visualization.slice';
import { DataList } from '@/features/data-panel/data-list';
import { EntityItem } from '@/features/data-panel/entity-item';
import { EventItem } from '@/features/data-panel/event-item';
import { GroupItem } from '@/features/data-panel/group-item';

interface DataViewProps {
  entities: Array<Entity>;
  events: Array<Event>;
  groupByEntityKind?: boolean;
  showChronolgyOnly?: boolean;
  targetHasVisualizations?: boolean;
  currentVisualizationIds?: Array<Visualization['id'] | null> | null;
  mode?: 'add' | 'remove';
  context: 'collections' | 'visualized';
}

export function DataView(props: DataViewProps): JSX.Element {
  const {
    entities,
    events,
    groupByEntityKind = true,
    showChronolgyOnly = false,
    targetHasVisualizations = false,
    currentVisualizationIds = null,
    mode = 'add',
    context,
  } = props;
  const { plural, t } = useI18n<'common'>();
  // PrepData / Sort
  const entitiesAsc = useMemo(() => {
    return entities
      .sort((a, b) => {
        return a.label.default > b.label.default ? 1 : b.label.default > a.label.default ? -1 : 0;
      })
      .sort((a, b) => {
        return b.relations.length - a.relations.length;
      });
  }, [entities]);

  const eventsAsc = useMemo(() => {
    const now = Date.now();
    return events.sort((eventA: Event, eventB: Event) => {
      const sortDateA =
        'startDate' in eventA
          ? new Date(eventA.startDate as string)
          : 'endDate' in eventA
          ? new Date(eventA.endDate as string)
          : now;
      const sortDateB =
        'startDate' in eventB
          ? new Date(eventB.startDate as string)
          : 'endDate' in eventB
          ? new Date(eventB.endDate as string)
          : now;
      return sortDateA - sortDateB;
    });
  }, [events]);

  return (
    <ScrollArea className="dark:border-neutral-700 h-full w-full border-neutral-100">
      <div className="px-0">
        <DataList
          items={showChronolgyOnly ? eventsAsc : entitiesAsc}
          groupedByProperty={groupByEntityKind ? 'kind' : undefined}
          orderGroupsByKeys={[
            'person',
            'cultural-heritage-object',
            'group',
            'historical-event',
            'place',
          ]}
        >
          {({ item, type }) => {
            switch (type) {
              case 'entity':
                return (
                  <EntityItem
                    entity={item}
                    icon={<EntityKindIcon kind={item.kind as EntityKind} />}
                    currentVisualizationIds={currentVisualizationIds}
                    targetHasVisualizations={targetHasVisualizations}
                    mode={mode}
                    context={context}
                  />
                );
              case 'event':
                return (
                  <EventItem
                    event={item}
                    currentVisualizationIds={currentVisualizationIds}
                    targetHasVisualizations={targetHasVisualizations}
                    mode={mode}
                    context={context}
                  />
                );
              case 'group':
                return (
                  <GroupItem
                    group={{
                      ...item,
                      label: t(['common', 'entity', 'kinds', item.label, plural(item.count)]),
                    }}
                    icon={<EntityKindIcon kind={item.label as EntityKind} />}
                    currentVisualizationIds={currentVisualizationIds}
                    targetHasVisualizations={targetHasVisualizations}
                  />
                );
            }
          }}
        </DataList>
      </div>
    </ScrollArea>
  );
}
