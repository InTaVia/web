import { AdjustmentsIcon } from '@heroicons/react/outline';
import { XIcon } from '@heroicons/react/solid';
import type { DragEvent } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store';
import type { EntityEvent, Person } from '@/api/intavia.models';
import type { Visualization } from '@/features/common/visualization.slice';
import {
  addEventToVisualization,
  addPersonToVisualization,
  selectAllVisualizations,
} from '@/features/common/visualization.slice';
import Button from '@/features/ui/Button';
import VisualisationComponent from '@/features/visualization-layouts/visualization';
import type { SlotId } from '@/features/visualization-layouts/workspaces.slice';

interface VisualisationContainerProps {
  visualizationSlot: SlotId;
  id: Visualization['id'] | null;
  onReleaseVisualization: (visSlot: string, visId: string) => void;
  onSwitchVisualization: (
    targetSlot: string,
    targetVis: string | null,
    soruceSlot: string,
    sourceVis: string | null,
  ) => void;
  setVisualizationEditElement?: (editElement: Visualization) => void;
}

export default function VisualisationContainer(props: VisualisationContainerProps): JSX.Element {
  const {
    visualizationSlot,
    id,
    onReleaseVisualization,
    onSwitchVisualization,
    setVisualizationEditElement,
  } = props;

  const dispatch = useAppDispatch();

  const allVisualizations = useAppSelector(selectAllVisualizations);

  const visualization = Object.values(allVisualizations).filter((vis: Visualization) => {
    return vis.id === id;
  })[0];

  let name = id;

  if (visualization !== undefined) {
    name = visualization.name;
    if (visualization.properties !== undefined) {
      if (
        visualization.properties.name !== undefined &&
        visualization.properties.name.value !== ''
      ) {
        name = visualization.properties.name.value;
      }
    }
  }

  const allowDrop = (event: DragEvent) => {
    event.preventDefault();
  };

  const drop = (event: DragEvent) => {
    event.preventDefault();
    const data = JSON.parse(event.dataTransfer.getData('Text'));

    switch (data.type) {
      case 'visualization':
        onSwitchVisualization(visualizationSlot, data.props.id, data.parent, id);
        break;
      case 'Person':
        dispatch(
          addPersonToVisualization({ visId: visualization!.id, person: data.props as Person }),
        );
        break;
      case 'Event':
        dispatch(
          addEventToVisualization({ visId: visualization!.id, event: data.props as EntityEvent }),
        );
        break;
      default:
        break;
    }
  };

  return (
    <div
      className="grid h-full w-full cursor-grabbing grid-rows-[29px_1fr]"
      onDrop={drop}
      onDragOver={allowDrop}
    >
      <div
        className="flex flex-row flex-nowrap justify-between gap-2 truncate bg-intavia-blue-400 px-2 py-1 text-white"
        draggable={true}
        onDragStart={(event) => {
          return event.dataTransfer.setData(
            'Text',
            JSON.stringify({
              type: 'visualization',
              props: visualization,
              parent: visualizationSlot,
              content: '',
            }),
          );
        }}
      >
        <div className="truncate">{name}</div>
        <div className="sticky right-0 flex flex-nowrap gap-1">
          <Button
            className="ml-auto grow-0"
            shadow="none"
            size="extra-small"
            round="circle"
            onClick={() => {
              if (setVisualizationEditElement !== undefined) {
                setVisualizationEditElement(visualization as Visualization);
              }
            }}
          >
            <AdjustmentsIcon className="h-3 w-3" />
          </Button>
          <Button
            className="ml-auto grow-0"
            shadow="none"
            size="extra-small"
            round="circle"
            onClick={() => {
              if (id !== null) {
                onReleaseVisualization(visualizationSlot, id);
              }
            }}
          >
            <XIcon className="h-3 w-3" />
          </Button>
        </div>
      </div>
      {visualization !== undefined && (
        <div>{<VisualisationComponent visualization={visualization} />}</div>
      )}
    </div>
  );
}
