import { Allotment } from 'allotment';
import { Fragment } from 'react';

import type { Visualization } from '@/features/common/visualization.slice';
import type { ContentSlotId, SlideContent } from '@/features/storycreator/contentPane.slice';
import { StoryContentPane } from '@/features/storycreator/StoryContentPane';
import type { PanelLayout } from '@/features/ui/analyse-page-toolbar/layout-popover';
import VisualizationContainer from '@/features/visualization-layouts/visualization-container';
import type { SlotId } from '@/features/visualization-layouts/workspaces.slice';
import VisualizationWizard from '@/features/visualization-wizard/visualization-wizard';

interface VisualisationGroupProps {
  visualizationSlots: Record<SlotId, string | null>;
  contentPaneSlots?: Record<ContentSlotId, string | null>;
  layout?: PanelLayout;
  onAddVisualization: (visSlot: string, visId: string) => void;
  onReleaseVisualization: (visSlot: string, visId: string) => void;
  onSwitchVisualization: (
    targetSlot: string,
    targetVis: string | null,
    soruceSlot: string,
    sourceVis: string | null,
  ) => void;
  onAddContentPane?: (slotId: string) => void;
  onDropContentPane?: (i_layout: any, i_layoutItem: any, event: any, i_targetPane: any) => void;
  onContentPaneWizard?: (i_layout: any, type: string, i_targetPane: any) => void;
  setEditElement?: (editElement: SlideContent) => void;
  setVisualizationEditElement?: (editElement: Visualization) => void;
}

export interface LayoutPaneContent {
  type: 'contentPane' | 'visualization';
  id: string;
  preferredSize?: string;
}

export interface LayoutRow {
  rows: Array<LayoutCol | LayoutPaneContent>;
}

export interface LayoutCol {
  cols: Array<LayoutPaneContent | LayoutRow>;
}

export type LayoutTemplateItem = LayoutCol | LayoutPaneContent | LayoutRow;
export class LayoutPaneContent {}

export const layoutTemplates: Record<PanelLayout, LayoutTemplateItem> = {
  'single-vis': { rows: [{ type: 'visualization', id: 'vis-1' }] },
  'single-vis-content': {
    cols: [
      { type: 'visualization', id: 'vis-1' },
      { type: 'contentPane', id: 'cont-1', preferredSize: '30%' },
    ],
  },
  'two-rows': {
    rows: [
      { type: 'visualization', id: 'vis-1' },
      { type: 'visualization', id: 'vis-2' },
    ],
  },
  'two-cols': {
    cols: [
      { type: 'visualization', id: 'vis-1' },
      { type: 'visualization', id: 'vis-2' },
    ],
  },
  'two-contents': {
    cols: [
      { type: 'contentPane', id: 'cont-1' },
      { type: 'contentPane', id: 'cont-2' },
    ],
  },
  'two-cols-content': {
    cols: [
      { type: 'visualization', id: 'vis-1' },
      { type: 'visualization', id: 'vis-2' },
      { type: 'contentPane', id: 'cont-1', preferredSize: '20%' },
    ],
  },
  'three-rows': {
    rows: [
      { type: 'visualization', id: 'vis-1' },
      { type: 'visualization', id: 'vis-2' },
      { type: 'visualization', id: 'vis-3' },
    ],
  },
  'three-cols': {
    cols: [
      { type: 'visualization', id: 'vis-1' },
      { type: 'visualization', id: 'vis-2' },
      { type: 'visualization', id: 'vis-3' },
    ],
  },
  'two-rows-one-right': {
    cols: [
      {
        rows: [
          { type: 'visualization', id: 'vis-1' },
          { type: 'visualization', id: 'vis-2' },
        ],
      },
      { type: 'visualization', id: 'vis-3' },
    ],
  },
  'two-rows-content': {
    cols: [
      {
        rows: [
          { type: 'visualization', id: 'vis-1' },
          { type: 'visualization', id: 'vis-2' },
        ],
      },
      { type: 'contentPane', id: 'cont-1', preferredSize: '30%' },
    ],
  },
  'two-rows-one-left': {
    cols: [
      { type: 'visualization', id: 'vis-1' },
      {
        rows: [
          { type: 'visualization', id: 'vis-2' },
          { type: 'visualization', id: 'vis-3' },
        ],
      },
    ],
  },
  /* 'two-cols-one-bottom': {
    rows: [
      {
        cols: [
          { type: 'visualization', id: 'vis-1' },
          { type: 'visualization', id: 'vis-2' },
        ],
      },
      { type: 'visualization', id: 'vis-3' },
    ],
  }, */
  /*  'two-cols-one-top': {
    rows: [
      { type: 'visualization', id: 'vis-1' },
      {
        cols: [
          { type: 'visualization', id: 'vis-2' },
          { type: 'visualization', id: 'vis-3' },
        ],
      },
    ],
  }, */
  // FIXME: remove grid-2x2; equals grid-2x2-cols
  'grid-2x2': {
    cols: [
      {
        rows: [
          { type: 'visualization', id: 'vis-1' },
          { type: 'visualization', id: 'vis-2' },
        ],
      },
      {
        rows: [
          { type: 'visualization', id: 'vis-3' },
          { type: 'visualization', id: 'vis-4' },
        ],
      },
    ],
  },
  /* 'grid-2x2-cols': {
    cols: [
      {
        rows: [
          { type: 'visualization', id: 'vis-1' },
          { type: 'visualization', id: 'vis-2' },
        ],
      },
      {
        rows: [
          { type: 'visualization', id: 'vis-3' },
          { type: 'visualization', id: 'vis-4' },
        ],
      },
    ],
  }, */
  /* 'grid-2x2-rows': {
    rows: [
      {
        cols: [
          { type: 'visualization', id: 'vis-1' },
          { type: 'visualization', id: 'vis-2' },
        ],
      },
      {
        cols: [
          { type: 'visualization', id: 'vis-3' },
          { type: 'visualization', id: 'vis-4' },
        ],
      },
    ],
  }, */
};

export default function VisualisationGroup(props: VisualisationGroupProps): JSX.Element {
  const {
    visualizationSlots,
    contentPaneSlots,
    onAddVisualization,
    onReleaseVisualization,
    onSwitchVisualization,
    onDropContentPane,
    onContentPaneWizard,
    setEditElement,
    setVisualizationEditElement,
    layout = 'single-vis',
  } = props;
  const selectedLayout = layoutTemplates[layout] as LayoutTemplateItem;

  const generateLayout = (layoutTemplate: LayoutTemplateItem) => {
    for (const [key, value] of Object.entries(layoutTemplate)) {
      if (key === 'cols' || key === 'rows') {
        return (
          <Allotment
            key={`alottment-${key}-${key === 'cols' ? false : true}`}
            vertical={key === 'cols' ? false : true}
          >
            {value.map((item: LayoutTemplateItem, index: number) => {
              return (
                <Allotment.Pane
                  preferredSize={
                    item instanceof LayoutPaneContent && item.preferredSize !== undefined
                      ? item.preferredSize
                      : ''
                  }
                  key={`${index}`}
                >
                  {generateLayout(item)}
                </Allotment.Pane>
              );
            })}
          </Allotment>
        );
      } else {
        const content = layoutTemplate as LayoutPaneContent;
        switch (content.type) {
          case 'visualization':
            if (visualizationSlots[content.id as SlotId] !== null) {
              return (
                <VisualizationContainer
                  visualizationSlot={content.id as SlotId}
                  id={visualizationSlots[content.id as SlotId]}
                  onReleaseVisualization={onReleaseVisualization}
                  onSwitchVisualization={onSwitchVisualization}
                  setVisualizationEditElement={setVisualizationEditElement}
                />
              );
            } else {
              return (
                <VisualizationWizard
                  visualizationSlot={content.id as SlotId}
                  onAddVisualization={onAddVisualization}
                />
              );
            }
          case 'contentPane':
            if (contentPaneSlots !== undefined) {
              if (contentPaneSlots[content.id as ContentSlotId] !== null) {
                return (
                  <StoryContentPane
                    id={contentPaneSlots[content.id as ContentSlotId] as string}
                    setEditElement={setEditElement}
                    onDrop={onDropContentPane}
                    onContentPaneWizard={onContentPaneWizard}
                  />
                );
              }
            }
            break;
          default:
            return <div>Something in the pane configuration went wrong ...</div>;
        }
      }
    }
  };

  return <Fragment>{generateLayout(selectedLayout)}</Fragment>;
}
