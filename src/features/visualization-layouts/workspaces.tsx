import {
  DocumentAddIcon as AddWorkspaceIcon,
  XIcon as CloseWorkspaceIcon,
} from '@heroicons/react/outline';
import { Dialog, IconButton, Tabs, TabsContent, TabsList, TabsTrigger } from '@intavia/ui';
import { Fragment, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store';
import { ComponentPropertiesDialog } from '@/features/common/component-properties-dialog';
import type { Visualization } from '@/features/common/visualization.slice';
import { editVisualization } from '@/features/common/visualization.slice';
import type { SlideContent } from '@/features/storycreator/contentPane.slice';
import type { PanelLayout } from '@/features/ui/analyse-page-toolbar/layout-popover';
import VisualizationGroup from '@/features/visualization-layouts/visualization-group';
import {
  addWorkspace,
  releaseVisualizationForVisualizationSlotForCurrentWorkspace,
  removeWorkspace,
  selectAllWorkspaces,
  setCurrentWorkspace,
  setVisualizationForVisualizationSlotForCurrentWorkspace,
  switchVisualizationsInWorkspace,
} from '@/features/visualization-layouts/workspaces.slice';

export default function Workspaces(): JSX.Element {
  const dispatch = useAppDispatch();
  const workspaces = useAppSelector(selectAllWorkspaces);

  function onChangeWorkspace(id: number) {
    dispatch(setCurrentWorkspace(id));
  }

  function onAddWorkspace() {
    dispatch(
      //FIXME get template from config (not in store, because can be used to programmatically add a preconfigured workspace)
      addWorkspace({
        id: '',
        label: 'New Workspace',
        layoutOption: 'single-vis',
        visualizationSlots: { 'vis-1': null, 'vis-2': null, 'vis-3': null, 'vis-4': null },
      }),
    );
  }

  function onRemoveWorkspace(id: number) {
    dispatch(removeWorkspace(id));
  }

  const onSwitchVisualization = (
    targetSlot: string,
    targetVis: string | null,
    sourceSlot: string,
    sourceVis: string | null,
  ) => {
    dispatch(
      switchVisualizationsInWorkspace({
        targetSlot,
        targetVis,
        sourceSlot,
        sourceVis,
        workspace: workspaces.currentWorkspace,
      }),
    );
  };

  const handleSaveVisualization = (element: Visualization) => {
    dispatch(editVisualization(element));
  };

  const handleCloseVisualizationDialog = () => {
    setVisualizationEditElement(null);
  };

  const [visualizationEditElement, setVisualizationEditElement] = useState<any | null>(null);

  // FIXME: why is workspaces.currentWorkspace the array index, not the id?
  return (
    <Fragment>
      <Tabs
        className="grid h-full w-full grid-rows-[1fr_auto] overflow-hidden"
        // @ts-expect-error using array indices (number) not string ids
        defaultValue={workspaces.currentWorkspace}
        // @ts-expect-error using array indices (number) not string ids
        onValueChange={onChangeWorkspace}
      >
        <div className="h-full basis-auto">
          {workspaces.workspaces.map((workspace, index) => {
            return (
              // @ts-expect-error using array indices (number) not string ids
              <TabsContent key={index} value={index} className="m-0 h-full w-full p-0">
                <VisualizationGroup
                  layout={workspace.layoutOption as PanelLayout}
                  visualizationSlots={workspace.visualizationSlots}
                  onAddVisualization={(visSlot: string, visId: string) => {
                    dispatch(
                      setVisualizationForVisualizationSlotForCurrentWorkspace({
                        visualizationSlot: visSlot,
                        visualizationId: visId,
                      }),
                    );
                  }}
                  onReleaseVisualization={(visSlot: string) => {
                    dispatch(releaseVisualizationForVisualizationSlotForCurrentWorkspace(visSlot));
                  }}
                  onSwitchVisualization={onSwitchVisualization}
                  setVisualizationEditElement={setVisualizationEditElement}
                />
              </TabsContent>
            );
          })}
        </div>

        <div className="relative flex w-full flex-row items-center justify-between gap-4 overflow-hidden bg-blue-900 py-1">
          <div>
            <IconButton
              size="sm"
              label="Add workspace"
              onClick={onAddWorkspace}
              // onDoubleClick={(event: MouseEvent<HTMLButtonElement>) => {
              //   event.preventDefault();
              // }}
            >
              <AddWorkspaceIcon className="h-5 w-5" />
            </IconButton>
          </div>

          <TabsList className="flex w-full items-center gap-4 bg-transparent">
            {workspaces.workspaces.map((workspace, index) => {
              return (
                <TabsTrigger
                  key={index}
                  // @ts-expect-error using array indices (number) not string ids
                  value={index}
                  className="m-0 rounded bg-white px-2 py-1 text-sm transition hover:bg-neutral-50"
                  // onDoubleClick={(event: MouseEvent<HTMLDivElement>) => {
                  //   event.preventDefault();
                  // }}
                >
                  {index === workspaces.currentWorkspace ? (
                    <div>
                      <span className="cursor-pointer whitespace-nowrap">{workspace.label}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="cursor-pointer whitespace-nowrap">{workspace.label}</span>
                      {workspaces.workspaces.length > 1 && (
                        <button
                          aria-label="Remove workspace"
                          onClick={() => {
                            onRemoveWorkspace(index);
                          }}
                          className="hover:text-neutral-700"
                        >
                          <CloseWorkspaceIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <div className="h-full basis-full" onDoubleClick={onAddWorkspace}></div>
        </div>
      </Tabs>

      {visualizationEditElement != null ? (
        <Dialog
          open={visualizationEditElement != null}
          onOpenChange={handleCloseVisualizationDialog}
        >
          <ComponentPropertiesDialog
            onClose={handleCloseVisualizationDialog}
            element={visualizationEditElement}
            onSave={handleSaveVisualization as (element: SlideContent | Visualization) => void}
          />
        </Dialog>
      ) : null}
    </Fragment>
  );
}
