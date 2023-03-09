import type { Entity, EntityKind } from '@intavia/api-client';
import { Button, CheckBox } from '@intavia/ui';
import { useContext, useState } from 'react';

import { PageContext } from '@/app/context/page.context';
import { useI18n } from '@/app/i18n/use-i18n';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { EntityKindIcon } from '@/features/common/entity-kind-icon';
import { entityKindOrder } from '@/features/common/entity-kinds';
import { addEntitiesToVisualization } from '@/features/common/visualization.slice';
import { DataList } from '@/features/data-panel/data-list';
import { EntityItem } from '@/features/data-panel/entity-item';
import { EventItem } from '@/features/data-panel/event-item';
import { GroupItem } from '@/features/data-panel/group-item';
import { selectStories } from '@/features/storycreator/storycreator.slice';
import { selectAllWorkspaces } from '@/features/visualization-layouts/workspaces.slice';

interface EntitiesPanelProps {
  entities: Array<Entity>;
}

export function EntitiesPanel(props: EntitiesPanelProps): JSX.Element {
  const { entities } = props;
  const { plural, t } = useI18n<'common'>();

  const [isGroupedByEntityKind, setIsGroupedByEntityKind] = useState<boolean>(true);

  const pageContext = useContext(PageContext);

  const dispatch = useAppDispatch();
  const workspaces = useAppSelector(selectAllWorkspaces);
  const currentWorkspace = workspaces.workspaces[workspaces.currentWorkspace];

  const stories = useAppSelector(selectStories);
  const currentSlide =
    pageContext.page === 'story-creator'
      ? Object.values(stories[pageContext.storyId]?.slides).filter((slide) => {
          return slide.selected;
        })[0]
      : null;

  const toggleGrouping = () => {
    setIsGroupedByEntityKind(!isGroupedByEntityKind);
  };

  function viewAllData() {
    let currentVisualizationIds = null;
    switch (pageContext.page) {
      case 'visual-analytics-studio':
        currentVisualizationIds = Object.values(currentWorkspace!.visualizationSlots);
        break;
      case 'story-creator':
        currentVisualizationIds = Object.values(currentSlide!.visualizationSlots);
        break;
      default:
        return;
    }
    if (currentVisualizationIds == null || currentVisualizationIds.length === 0) return;

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
    <div className="flex h-full flex-col overflow-auto text-sm">
      {/* <EntityPanelTasks /> */}
      <div className="flex min-h-fit flex-col items-start gap-2 bg-neutral-200 p-2">
        <Button size="xs" onClick={viewAllData}>
          Add All
        </Button>
        <div className="flex flex-row items-center gap-x-1.5">
          <CheckBox
            id="groupByEntityKind"
            name="groupByEntityKind"
            value="groupByEntityKind"
            checked={isGroupedByEntityKind}
            onCheckedChange={toggleGrouping}
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
