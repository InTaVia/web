import { useAppDispatch } from '@/app/store';
import type { Visualization } from '@/features/common/visualization.slice';
import { createVisualization } from '@/features/common/visualization.slice';
import Button from '@/features/ui/Button';
import type { SlotId } from '@/features/visualization-layouts/workspaces.slice';

interface VisualizationWizardProps {
  visualizationSlot: SlotId;
  onAddVisualization: (visualizationSlot: string, visId: string) => void;
}
export default function VisualizationWizard(props: VisualizationWizardProps): JSX.Element {
  const { visualizationSlot, onAddVisualization } = props;
  const dispatch = useAppDispatch();

  function createVis(type: Visualization['type']) {
    const visId = `visualization-${Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .substring(0, 4)}`;
    //TODO dispatch -> createVisualisation -> common/visualization.slice
    dispatch(
      createVisualization({
        id: visId,
        type: type,
        name: visId,
        entityIds: [],
        eventIds: [],
      }),
    );

    return visId;
  }

  function onButtonClick(type: Visualization['type']) {
    const visId = createVis(type);
    onAddVisualization(visualizationSlot, visId);
  }

  return (
    <div className="flex h-full w-full items-center justify-center p-5">
      <div className="grid grid-cols-2 gap-2">
        <Button
          round="round"
          color="accent"
          onClick={() => {
            onButtonClick('map');
          }}
        >
          Create Map Visualization
        </Button>
        <Button
          round="round"
          color="accent"
          onClick={() => {
            onButtonClick('timeline');
          }}
        >
          Create Timeline Visualization
        </Button>
      </div>
    </div>
  );
}
