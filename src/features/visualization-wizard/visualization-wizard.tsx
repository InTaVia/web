import { Button } from '@intavia/ui';
import { nanoid } from '@reduxjs/toolkit';
import { useContext, useMemo, useState } from 'react';
import { isConstructorDeclaration } from 'typescript';

import { PageContext } from '@/app/context/page.context';
import { useAppDispatch, useAppSelector } from '@/app/store';
import type { Visualization } from '@/features/common/visualization.slice';
import {
  createVisualization,
  selectAllVisualizations,
} from '@/features/common/visualization.slice';
import type { SlotId } from '@/features/visualization-layouts/workspaces.slice';
import { VisualizationSelect } from '@/features/visualization-wizard/visualization-select';

interface VisualizationWizardProps {
  visualizationSlot: SlotId;
  onAddVisualization: (visualizationSlot: string, visId: string) => void;
}
export default function VisualizationWizard(props: VisualizationWizardProps): JSX.Element {
  const { visualizationSlot, onAddVisualization } = props;
  const dispatch = useAppDispatch();
  const [selectedVisualizationId, setSelectedVisualizationId] = useState<
    Visualization['id'] | null
  >(null);
  const visualizations = useAppSelector(selectAllVisualizations);
  const pageContext = useContext(PageContext);

  function createVis(type: Visualization['type']) {
    const visId = `visualization-${nanoid(4)}`;

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

  function onLoadVisualization() {
    // console.log('load', selectedVisualizationId, 'into', visualizationSlot);
    onAddVisualization(visualizationSlot, selectedVisualizationId);
  }

  console.log(pageContext);

  return (
    <div className="grid h-full w-full place-content-center gap-5 p-5">
      <div className="grid gap-2 md:grid-cols-2">
        <Button
          onClick={() => {
            onButtonClick('map');
          }}
        >
          Create Map Visualization
        </Button>
        <Button
          onClick={() => {
            onButtonClick('timeline');
          }}
        >
          Create Timeline Visualization
        </Button>
        {pageContext.page !== 'story-creator' && (
        <Button
          onClick={() => {
            onButtonClick('ego-network');
          }}
        >
          Create Network Visualization
        </Button>)}
      </div>

      {Object.keys(visualizations).length > 0 && (
        <div className="grid gap-2 border-t pt-4 md:grid-cols-2">
          <VisualizationSelect
            options={visualizations}
            setSelectedVisualizationId={setSelectedVisualizationId}
            selectedVisualizationId={selectedVisualizationId}
          />
          <Button onClick={onLoadVisualization}>Add Visualization</Button>
        </div>
      )}
    </div>
  );
}
