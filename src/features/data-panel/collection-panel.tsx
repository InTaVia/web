import { AdjustmentsIcon } from '@heroicons/react/outline';
import { ChevronRightIcon, XIcon } from '@heroicons/react/solid';
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  IconButton,
  Label,
  Switch,
} from '@intavia/ui';
import Link from 'next/link';
import { useContext, useEffect, useMemo, useState } from 'react';

import { PageContext } from '@/app/context/page.context';
import { useI18n } from '@/app/i18n/use-i18n';
import { useAppDispatch, useAppSelector } from '@/app/store';
import type { Collection } from '@/app/store/intavia-collections.slice';
import { selectCollectionsCount } from '@/app/store/intavia-collections.slice';
import { NothingFoundMessage } from '@/components/nothing-found-message';
import { useDataFromCollection } from '@/features/common/data/use-data-from-collection';
import type { Visualization } from '@/features/common/visualization.slice';
import {
  addEntitiesToVisualization,
  addEventsToVisualization,
  addTargetEntitiesToVisualization,
} from '@/features/common/visualization.slice';
import { CollectionSelect } from '@/features/data-panel/collection-select';
import { DataView } from '@/features/data-panel/data-view';
import type { Story } from '@/features/storycreator/storycreator.slice';
import { selectStories } from '@/features/storycreator/storycreator.slice';
import { selectAllWorkspaces } from '@/features/visualization-layouts/workspaces.slice';

export function CollectionPanel(): JSX.Element {
  const { t } = useI18n<'common'>();
  const dispatch = useAppDispatch();
  const [selectedCollection, setSelectedCollection] = useState<Collection['id']>('');

  const [settingsOpen, setSettingsOpen] = useState(true);

  const [groupByEntityKind, setGroupByEntityKind] = useState(true);
  const [showChronolgyOnly, setShowChronolgyOnly] = useState(false);

  const collectionsCount = useAppSelector(selectCollectionsCount);

  const onCollectionChange = (collection: Collection['id']) => {
    setSelectedCollection(collection);
  };

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
        currentVisualizationIds = Object.values(currentSlide!.visualizationSlots);
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

  const { entities, events } = useDataFromCollection({ collectionId: selectedCollection });

  useEffect(() => {
    if (events.length === 0) {
      setShowChronolgyOnly(false);
    }
  }, [events.length]);

  function addAllEntitiesToVisualizations() {
    if (currentVisualizationIds == null || currentVisualizationIds.length === 0) return;

    // console.log(currentVisualizationIds);
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

  function addChronologyToVisualizations() {
    if (currentVisualizationIds == null || currentVisualizationIds.length === 0) return;

    // console.log(currentVisualizationIds);
    for (const visualizationId of currentVisualizationIds) {
      if (visualizationId != null) {
        dispatch(
          addEventsToVisualization({
            visId: visualizationId,
            events: events.map((event) => {
              return event.id;
            }),
          }),
        );
        //FIXME Workaroud for DHD WS
        dispatch(
          addTargetEntitiesToVisualization({
            visId: visualizationId,
            targetEntities: ['data-duerer-pr-001', 'data-duerer-macro-pr-001'],
          }),
        );
      }
    }
  }

  if (collectionsCount === 0) {
    return (
      <div className="p-3">
        <Link href={{ pathname: '/search' }}>
          <Button
            className="flex w-full place-content-center gap-2"
            type="button"
            variant="outline"
          >
            Please create a collection
            <ChevronRightIcon className="h-5 w-5 shrink-0" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-1 overflow-hidden">
      <div className="p-2">
        <CollectionSelect onChange={onCollectionChange} />
      </div>

      {entities.length === 0 && selectedCollection !== '' && (
        <div className="flex h-full w-full flex-col place-items-center justify-start bg-neutral-50">
          <NothingFoundMessage>
            {t(['common', 'collections', 'empty-collection'])}
          </NothingFoundMessage>
          <div className="p-3">
            <Link href={{ pathname: '/search' }}>
              <Button
                className="flex w-full place-content-center gap-2"
                type="button"
                variant="outline"
              >
                Please add entities to the collection
                <ChevronRightIcon className="h-5 w-5 shrink-0" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/**Toolbar */}
      {entities.length > 0 && selectedCollection !== '' && targetHasVisualizations && (
        <div className="bg-neutral-100 p-2">
          {!showChronolgyOnly && (
            <Button variant={'outline'} size={'xs'} onClick={addAllEntitiesToVisualizations}>
              Add all entities
            </Button>
          )}
          {showChronolgyOnly && events.length > 0 && (
            <Button variant={'outline'} size={'xs'} onClick={addChronologyToVisualizations}>
              Add chronology
            </Button>
          )}
        </div>
      )}

      {/**Settings */}
      {entities.length > 0 && selectedCollection !== '' && (
        <div className="bg-neutral-100 px-3 py-2">
          <Collapsible
            defaultOpen={settingsOpen}
            open={settingsOpen}
            onOpenChange={setSettingsOpen}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm">Settings</span>
              <CollapsibleTrigger asChild>
                <IconButton className="h-5 w-5" variant="outline" label="settings">
                  {settingsOpen ? (
                    <XIcon aria-hidden="true" className="h-3 w-3 shrink-0" />
                  ) : (
                    <AdjustmentsIcon aria-hidden="true" className="h-3 w-3 shrink-0" />
                  )}
                </IconButton>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="flex items-center gap-x-2 p-1">
                <Switch
                  id="group-by-entity-type"
                  defaultChecked={groupByEntityKind}
                  onCheckedChange={setGroupByEntityKind}
                  disabled={showChronolgyOnly && events.length > 0}
                />
                <Label htmlFor="group-by-entity-type">Group-by entity type</Label>
              </div>
              {events.length > 0 && (
                <>
                  <div className="flex items-center gap-x-2 p-1">
                    <Switch
                      id="show-chronology-of-events-only"
                      defaultChecked={showChronolgyOnly}
                      onCheckedChange={setShowChronolgyOnly}
                    />
                    <Label htmlFor="show-chronology-of-events-only">
                      Show chronology of events only
                    </Label>
                  </div>
                  {/* <div className="flex items-center gap-x-2 p-1">
                    <Switch
                      id="group-by-event-type"
                      defaultChecked={false}
                      disabled={!showChronolgyOnly}
                    />
                    <Label htmlFor="group-by-event-typey">Group-by event type</Label>
                  </div> */}
                </>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}

      {entities.length > 0 && selectedCollection !== '' && (
        <DataView
          entities={entities}
          events={events}
          groupByEntityKind={groupByEntityKind}
          showChronolgyOnly={showChronolgyOnly}
          targetHasVisualizations={targetHasVisualizations}
          currentVisualizationIds={currentVisualizationIds}
        />
      )}
    </div>
  );
}
