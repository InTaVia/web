import { useAppDispatch } from '@/app/store';
import { createVisualization } from '@/features/common/visualization.slice';
import Button from '@/features/ui/Button';
import type { SlotId } from '@/features/visualization-layouts/workspaces.slice';
import { setVisualizationForVisualizationSlotForCurrentWorkspace } from '@/features/visualization-layouts/workspaces.slice';

interface VisualizationWizardProps {
  visualizationSlot: SlotId;
}
export default function VisualizationWizard(props: VisualizationWizardProps): JSX.Element {
  const { visualizationSlot } = props;
  const dispatch = useAppDispatch();

  function onAddVisualization() {
    const visId = `visualization-${Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .substring(0, 4)}`;
    // dispatch();
    //TODO dispatch -> createVisualisation -> common/visualization.slice
    dispatch(
      createVisualization({
        id: visId,
        type: 'map',
        name: visId,
        entityIds: [],
        eventIds: [],
        props: {},
      }),
    );
    dispatch(
      setVisualizationForVisualizationSlotForCurrentWorkspace({
        visualizationSlot: visualizationSlot,
        visualizationId: visId,
      }),
    );
  }

  return (
    <Button
      size="small"
      color="warning"
      round="round"
      onClick={onAddVisualization}
      className="ml-auto self-end"
    >
      Add Visualization
    </Button>
  );
}
