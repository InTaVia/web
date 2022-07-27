import { Allotment } from 'allotment';
import { Fragment } from 'react';

import VisualizationContainer from '@/features/visualization-layouts/visualization-container';
import type { SlotId, Workspace } from '@/features/visualization-layouts/workspaces.slice';
import VisualizationWizard from '@/features/visualization-wizard/visualization-wizard';

interface VisualisationGroupProps {
  workspace: Workspace;
}

interface LayoutPaneContent {
  content: string;
}

interface LayoutRow {
  rows: Array<LayoutCol | LayoutPaneContent>;
}

interface LayoutCol {
  cols: Array<LayoutPaneContent | LayoutRow>;
}

type LayoutTemplateItem = LayoutCol | LayoutPaneContent | LayoutRow;

const layoutTemplates: Record<string, LayoutTemplateItem> = {
  'single-pane': { rows: [{ content: 'vis-1' }] },
  'two-rows': { rows: [{ content: 'vis-1' }, { content: 'vis-2' }] },
  'two-cols': { cols: [{ content: 'vis-1' }, { content: 'vis-2' }] },
  'three-rows': { rows: [{ content: 'vis-1' }, { content: 'vis-2' }, { content: 'vis-3' }] },
  'three-cols': { cols: [{ content: 'vis-1' }, { content: 'vis-2' }, { content: 'vis-3' }] },
  'two-rows-one-right': {
    cols: [{ rows: [{ content: 'vis-1' }, { content: 'vis-2' }] }, { content: 'vis-3' }],
  },
  'two-rows-one-left': {
    cols: [{ content: 'vis-1' }, { rows: [{ content: 'vis-2' }, { content: 'vis-3' }] }],
  },
  'two-cols-one-bottom': {
    rows: [{ cols: [{ content: 'vis-1' }, { content: 'vis-2' }] }, { content: 'vis-3' }],
  },
  'two-cols-one-top': {
    rows: [{ content: 'vis-1' }, { cols: [{ content: 'vis-2' }, { content: 'vis-3' }] }],
  },
  // FIXME: remove grid-2x2; equals grid-2x2-cols
  'grid-2x2': {
    cols: [
      { rows: [{ content: 'vis-1' }, { content: 'vis-2' }] },
      { rows: [{ content: 'vis-3' }, { content: 'vis-4' }] },
    ],
  },
  'grid-2x2-cols': {
    cols: [
      { rows: [{ content: 'vis-1' }, { content: 'vis-2' }] },
      { rows: [{ content: 'vis-3' }, { content: 'vis-4' }] },
    ],
  },
  'grid-2x2-rows': {
    rows: [
      { cols: [{ content: 'vis-1' }, { content: 'vis-2' }] },
      { cols: [{ content: 'vis-3' }, { content: 'vis-4' }] },
    ],
  },
};

export default function VisualisationGroup(props: VisualisationGroupProps): JSX.Element {
  const { workspace } = props;
  const layout = workspace.layoutOption;
  console.log(layout, layoutTemplates[layout]);
  const selectedLayout = layoutTemplates[layout] as LayoutTemplateItem;

  const generateLayout = (layoutTemplate: LayoutTemplateItem) => {
    for (const [key, value] of Object.entries(layoutTemplate)) {
      console.log(`${key}: ${value}`);
      if (key === 'cols' || key === 'rows') {
        return (
          <Allotment
            key={`alottment-${key}-${key === 'cols' ? false : true}`}
            vertical={key === 'cols' ? false : true}
          >
            {value.map((item: LayoutTemplateItem, index: number) => {
              return <Allotment.Pane key={`${index}`}>{generateLayout(item)}</Allotment.Pane>;
            })}
          </Allotment>
        );
      } else if (key === 'content') {
        if (workspace.visualizationSlots[value as SlotId] !== null) {
          return (
            <VisualizationContainer
              workspaceId={workspace.id}
              visualizationSlot={value}
              id={workspace.visualizationSlots[value as SlotId]}
            />
          );
        } else {
          return <VisualizationWizard visualizationSlot={value} />;
        }
      }
    }
  };

  return <Fragment>{generateLayout(selectedLayout)}</Fragment>;
}
