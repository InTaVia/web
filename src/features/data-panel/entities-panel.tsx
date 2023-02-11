import type { Entity, EntityKind } from '@intavia/api-client';
import { useState } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { EntityKindIcon } from '@/features/common/entity-kind-icon';
import { entityKindOrder } from '@/features/common/entity-kinds';
import { addEntitiesToVisualization } from '@/features/common/visualization.slice';
import { DataList } from '@/features/data-panel/data-list';
import { EntityItem } from '@/features/data-panel/entity-item';
import { EventItem } from '@/features/data-panel/event-item';
import { GroupItem } from '@/features/data-panel/group-item';
import Button from '@/features/ui/Button';
import { selectAllWorkspaces } from '@/features/visualization-layouts/workspaces.slice';

interface EntitiesPanelProps {
  entities: Array<Entity>;
}

export function EntitiesPanel(props: EntitiesPanelProps): JSX.Element {
  const { entities } = props;
  const { plural, t } = useI18n<'common'>();

  const [isGroupedByEntityKind, setIsGroupedByEntityKind] = useState<boolean>(true);

  const dispatch = useAppDispatch();
  const workspaces = useAppSelector(selectAllWorkspaces);
  const currentWorkspace = workspaces.workspaces[workspaces.currentWorkspace];

  const toggleGrouping = () => {
    setIsGroupedByEntityKind(!isGroupedByEntityKind);
  };

  function viewAllData() {
    const currentVisualizationIds = Object.values(currentWorkspace!.visualizationSlots);
    for (const visualizationId of currentVisualizationIds) {
      if (visualizationId != null) {
        dispatch(
          addEntitiesToVisualization({
            visId: visualizationId,
            entities: entities.map((entity) => {
              return entity.id;
            }),
          }),
        );
      }
    }
  }

  return (
    <div className="flex h-full flex-col overflow-auto">
      {/* <EntityPanelTasks /> */}
      <div className="flex min-h-fit flex-col items-start bg-slate-200 p-2">
        <Button size="small" color="accent" round="pill" onClick={viewAllData}>
          Add All
        </Button>
        <div className="flex flex-row gap-x-1">
          <input
            type="checkbox"
            id="groupByEntityKind"
            name="groupByEntityKind"
            value="groupByEntityKind"
            checked={isGroupedByEntityKind}
            onChange={toggleGrouping}
          />
          <label htmlFor="groupByEntityKind">Group entities by kind</label>
        </div>
      </div>

      <div className="h-full overflow-auto">
        <DataList
          items={entities}
          groupedByProperty={isGroupedByEntityKind ? 'kind' : undefined}
          orderGroupsByKeys={entityKindOrder}
        >
          {({ item, type }) => {
            switch (type) {
              case 'entity':
                return (
                  <EntityItem
                    entity={item}
                    icon={<EntityKindIcon kind={item.kind as EntityKind} />}
                  />
                );
              case 'event':
                return <EventItem event={item} />;
              case 'group':
                return (
                  <GroupItem
                    group={{
                      ...item,
                      label: t(['common', 'entity', 'kinds', item.label, plural(item.count)]),
                    }}
                    icon={<EntityKindIcon kind={item.label as EntityKind} />}
                  />
                );
            }
          }}
        </DataList>
      </div>
    </div>
  );
}

{
}
