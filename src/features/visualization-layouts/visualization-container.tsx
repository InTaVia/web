import { AdjustmentsIcon } from '@heroicons/react/outline';
import { XIcon } from '@heroicons/react/solid';

import { useAppDispatch } from '@/app/store';
import type { Visualization } from '@/features/common/visualization.slice';
import Button from '@/features/ui/Button';
import type { SlotId, Workspace } from '@/features/visualization-layouts/workspaces.slice';
import { releaseVisualizationForVisualizationSlotForCurrentWorkspace } from '@/features/visualization-layouts/workspaces.slice';

interface VisualisationContainerProps {
  workspaceId: Workspace['id'];
  visualizationSlot: SlotId;
  id: Visualization['id'] | null;
}

export default function VisualisationContainer(props: VisualisationContainerProps): JSX.Element {
  const { visualizationSlot, id } = props;
  const dispatch = useAppDispatch();
  //TODO: HeaderArea with Icons
  //TODO: VisualisatinArea

  //TODO getVisualization for Slot for Current Workspace

  function onReleaseVisualizationSlot() {
    dispatch(releaseVisualizationForVisualizationSlotForCurrentWorkspace(visualizationSlot));
  }

  return (
    <div className="grid h-full w-full grid-rows-[auto_1fr]">
      <div className="flex flex-row flex-nowrap justify-between gap-2 truncate bg-indigo-800 px-2 py-1 text-white">
        <div className="truncate">Visualization Container for: {id}</div>
        <div className="sticky right-0 flex flex-nowrap gap-1">
          <Button className="ml-auto grow-0" shadow="none" size="extra-small" round="circle">
            <AdjustmentsIcon className="h-3 w-3" />
          </Button>
          <Button
            className="ml-auto grow-0"
            shadow="none"
            size="extra-small"
            round="circle"
            onClick={onReleaseVisualizationSlot}
          >
            <XIcon className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="relative h-full w-full bg-red-100">{/* <GeoMap {...baseMap} /> */}</div>
    </div>
  );
}
