import { Tabs, TabsContent, TabsList, TabsTrigger } from '@intavia/ui';
import { useContext, useMemo } from 'react';

import { PageContext } from '@/app/context/page.context';
import { useAppSelector } from '@/app/store';
import type { Visualization } from '@/features/common/visualization.slice';
import { CollectionPanel } from '@/features/data-panel/collection-panel';
import { VisualizedPanel } from '@/features/data-panel/visualized-panel';
import type { Story } from '@/features/storycreator/storycreator.slice';
import { selectStories } from '@/features/storycreator/storycreator.slice';
import { selectAllWorkspaces } from '@/features/visualization-layouts/workspaces.slice';

export function DataPanel(): JSX.Element {
  const pageContext = useContext(PageContext);

  const workspaces = useAppSelector(selectAllWorkspaces);
  const stories: Record<Story['id'], Story> = useAppSelector(selectStories);

  const { currentVisualizationIds, targetHasVisualizations } = useMemo(() => {
    const currentWorkspace = workspaces.workspaces[workspaces.currentWorkspace];

    const currentSlide =
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      pageContext.page === 'story-creator' && stories != null
        ? Object.values(stories[pageContext.storyId].slides).filter((slide) => {
            return slide.selected;
          })[0]
        : null;

    let currentVisualizationIds: Array<Visualization['id'] | null> | null = null;
    let targetHasVisualizations = false;
    switch (pageContext.page) {
      case 'visual-analytics-studio':
        currentVisualizationIds = Object.values(currentWorkspace!.visualizationSlots);
        break;
      case 'story-creator':
        currentVisualizationIds =
          currentSlide != null ? Object.values(currentSlide!.visualizationSlots) : null;
        break;
    }

    if (currentVisualizationIds != null) {
      targetHasVisualizations = !currentVisualizationIds.every((visId) => {
        return visId === null;
      });
    }

    return { currentVisualizationIds, targetHasVisualizations };
  }, [
    pageContext.page,
    pageContext.storyId,
    stories,
    workspaces.currentWorkspace,
    workspaces.workspaces,
  ]);

  const tabs = {
    collections: {
      label: 'Collections',
      panel: (
        <CollectionPanel
          currentVisualizationIds={currentVisualizationIds}
          targetHasVisualizations={targetHasVisualizations}
        />
      ),
    },
    visualised: {
      label: 'Visualized',
      panel: (
        <VisualizedPanel
          currentVisualizationIds={currentVisualizationIds}
          targetHasVisualizations={targetHasVisualizations}
        />
      ),
    },
  };

  return (
    <Tabs className="grid h-full grid-rows-[auto_1fr] overflow-hidden" defaultValue="collections">
      <TabsList className="w-full">
        {Object.entries(tabs).map(([id, tab]) => {
          return (
            <TabsTrigger key={id} value={id} className="grow">
              {tab.label}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {Object.entries(tabs).map(([id, tab]) => {
        return (
          <TabsContent key={id} value={id} className="m-0 h-full overflow-hidden rounded-none p-0">
            {tab.panel}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
