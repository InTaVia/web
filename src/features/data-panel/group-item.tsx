import { PlusSmIcon } from '@heroicons/react/outline';
import { Collapsible, CollapsibleContent, CollapsibleTrigger, IconButton } from '@intavia/ui';
import type { MouseEvent, ReactNode } from 'react';
import { useState } from 'react';

import { useAppDispatch } from '@/app/store';
import type { Visualization } from '@/features/common/visualization.slice';
import { addEntitiesToVisualization } from '@/features/common/visualization.slice';
import type { GroupData } from '@/features/data-panel/data-list';

interface GroupItemProps {
  group: GroupData;
  showCount?: boolean;
  icon?: ReactNode;
  currentVisualizationIds?: Array<Visualization['id'] | null> | null;
  targetHasVisualizations?: boolean;
}

export function GroupItem(props: GroupItemProps): JSX.Element {
  const {
    group,
    showCount = true,
    icon = null,
    currentVisualizationIds = null,
    targetHasVisualizations = false,
  } = props;
  const dispatch = useAppDispatch();
  const [isHovered, setIsHovered] = useState(false);

  function addEntityToVisualizations() {
    if (currentVisualizationIds == null || currentVisualizationIds.length === 0) return;

    // console.log(currentVisualizationIds);
    for (const visualizationId of currentVisualizationIds) {
      if (visualizationId != null) {
        dispatch(
          addEntitiesToVisualization({
            visId: visualizationId,
            entities: group.childrenIds.map((entityId) => {
              return entityId;
            }),
          }),
        );
      }
    }
  }

  return (
    <div className="grid border border-neutral-200">
      <Collapsible>
        <CollapsibleTrigger asChild className="cursor-pointer">
          <div
            className="flex w-full  flex-row items-center justify-between p-2 text-left hover:bg-slate-100"
            onMouseEnter={() => {
              setIsHovered(true);
            }}
            onMouseLeave={() => {
              setIsHovered(false);
            }}
          >
            <div className="flex flex-row items-center gap-2">
              {icon}
              {showCount && <span>{group.count}</span>}
              <span className="text-sm font-medium text-neutral-900">{group.label}</span>
            </div>

            <div>
              {isHovered && targetHasVisualizations && (
                <IconButton
                  className="h-5 w-5"
                  variant="outline"
                  label="add"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    addEntityToVisualizations();
                    e.preventDefault();
                  }}
                >
                  <PlusSmIcon aria-hidden="true" className="h-3 w-3 shrink-0" />
                </IconButton>
              )}
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>{group.children}</CollapsibleContent>
      </Collapsible>
    </div>
  );
}
