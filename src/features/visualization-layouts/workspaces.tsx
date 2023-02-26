import { Tab } from '@headlessui/react';
import {
  DocumentAddIcon as AddWorkspaceIcon,
  XIcon as CloseWorkspaceIcon,
} from '@heroicons/react/outline';
import { clsx } from 'clsx';
import type { MouseEvent } from 'react';
import { useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store';
import { ComponentPropertiesDialog } from '@/features/common/component-properties-dialog';
import type { Visualization } from '@/features/common/visualization.slice';
import { editVisualization } from '@/features/common/visualization.slice';
import type { SlideContent } from '@/features/storycreator/contentPane.slice';
import type { PanelLayout } from '@/features/ui/analyse-page-toolbar/layout-popover';
import Button from '@/features/ui/Button';
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
        label: 'Visualisation',
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

  return (
    <>
      <Tab.Group
        selectedIndex={workspaces.currentWorkspace}
        onChange={onChangeWorkspace}
        defaultIndex={0}
      >
        <Tab.Panels className="h-full basis-auto">
          {workspaces.workspaces.map((workspace, idx) => {
            return (
              <Tab.Panel key={idx} className="h-full w-full p-0">
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
              </Tab.Panel>
            );
          })}
        </Tab.Panels>
        <div className="flex h-12 w-full flex-row items-center justify-between overflow-hidden bg-blue-900">
          <div className="p-1">
            <Button
              className="ml-auto grow-0"
              shadow="none"
              size="small"
              round="circle"
              color="accent"
              onClick={onAddWorkspace}
              onDoubleClick={(event: MouseEvent<HTMLButtonElement>) => {
                event.preventDefault();
              }}
            >
              <AddWorkspaceIcon className="h-5 w-5" />
            </Button>
          </div>
          <Tab.List className="flex w-full grow basis-1 space-x-1" as="div">
            {workspaces.workspaces.map((workspace, idx) => {
              return (
                <Tab
                  as="div"
                  key={workspace.id}
                  className={({ selected }) => {
                    return clsx({
                      ['flex cursor-pointer rounded-sm px-2 py-2 text-sm font-medium leading-5 text-blue-700']:
                        true, //always applies
                      ['bg-white shadow']: selected, //only when open === true
                      ['text-blue-100 hover:bg-white/[0.12] hover:text-white']: !selected,
                    });
                  }}
                  onDoubleClick={(event: MouseEvent<HTMLDivElement>) => {
                    event.preventDefault();
                  }}
                >
                  {({ selected }) => {
                    return selected ? (
                      <div className="flex items-center gap-2">
                        <p className="cursor-pointer whitespace-nowrap">{workspace.label}</p>
                        {workspaces.workspaces.length > 1 && (
                          <Button
                            shadow="none"
                            size="extra-small"
                            round="circle"
                            onClick={() => {
                              return onRemoveWorkspace(idx);
                            }}
                          >
                            <CloseWorkspaceIcon className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="cursor-pointer whitespace-nowrap">{workspace.label}</p>
                      </div>
                    );
                  }}
                </Tab>
              );
            })}
          </Tab.List>
          <div className="h-full basis-full" onDoubleClick={onAddWorkspace}></div>
        </div>
      </Tab.Group>
      {visualizationEditElement != null && (
        <ComponentPropertiesDialog
          onClose={handleCloseVisualizationDialog}
          element={visualizationEditElement}
          onSave={handleSaveVisualization as (element: SlideContent | Visualization) => void}
        />
      )}
    </>
  );
}
