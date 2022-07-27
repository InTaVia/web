import { Tab } from '@headlessui/react';
import {
  DocumentAddIcon as AddWorkspaceIcon,
  XIcon as CloseWorkspaceIcon,
} from '@heroicons/react/outline';
import { clsx } from 'clsx';

import { useAppDispatch, useAppSelector } from '@/app/store';
import Button from '@/features/ui/Button';
import VisualizationGroup from '@/features/visualization-layouts/visualization-group';
import {
  addWorkspace,
  removeWorkspace,
  selectAllWorkspaces,
  setCurrentWorkspace,
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
        layoutOption: 'single-pane',
        visualizationSlots: { 'vis-1': null, 'vis-2': null, 'vis-3': null, 'vis-4': null },
      }),
    );
  }

  function onRemoveWorkspace(id: number) {
    dispatch(removeWorkspace(id));
  }

  return (
    <Tab.Group
      selectedIndex={workspaces.currentWorkspace}
      onChange={onChangeWorkspace}
      defaultIndex={0}
    >
      <Tab.Panels className="h-full w-full grow bg-indigo-300">
        {workspaces.workspaces.map((workspace, idx) => {
          return (
            <Tab.Panel key={idx} className="h-full w-full p-0">
              <VisualizationGroup workspace={workspace} />
            </Tab.Panel>
          );
        })}
      </Tab.Panels>
      <Tab.List className="flex grow-0 space-x-1 bg-blue-900 p-1">
        {workspaces.workspaces.map((workspace, idx) => {
          return (
            <Tab
              key={workspace.id}
              className={({ selected }) => {
                return clsx({
                  ['rounded-sm py-1 px-2 text-sm font-medium leading-5 text-blue-700']: true, //always applies
                  ['bg-white shadow']: selected, //only when open === true
                  ['text-blue-100 hover:bg-white/[0.12] hover:text-white']: !selected,
                });
              }}
            >
              {({ selected }) => {
                return selected ? (
                  <div className="flex gap-2">
                    {workspace.label}
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
                  </div>
                ) : (
                  workspace.label
                );
              }}
            </Tab>
          );
        })}
        <div className="grow"></div>
        <Button
          className="ml-auto grow-0"
          shadow="none"
          size="small"
          round="circle"
          color="accent"
          onClick={onAddWorkspace}
        >
          <AddWorkspaceIcon className="h-5 w-5" />
        </Button>
      </Tab.List>
    </Tab.Group>
  );
}
