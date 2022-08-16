import type { RefObject } from 'react';
import { useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  addContentToContentPane,
  createContentPane,
  editSlideContent,
} from '@/features/storycreator/contentPane.slice';
import { StoryContentDialog } from '@/features/storycreator/StoryContentDialog';
import type { Slide } from '@/features/storycreator/storycreator.slice';
import {
  releaseVisualizationForVisualizationSlotForSlide,
  setContentPaneToSlot,
  setVisualizationForVisualizationSlotForStorySlide,
  switchVisualizations,
} from '@/features/storycreator/storycreator.slice';
import type { PanelLayout } from '@/features/ui/analyse-page-toolbar/layout-popover';
import type { UiWindow } from '@/features/ui/ui.slice';
import { selectWindows } from '@/features/ui/ui.slice';
import VisualizationGroup from '@/features/visualization-layouts/visualization-group';

interface SlideEditorProps {
  width?: number | undefined;
  height?: number | undefined; // FIXME: unused
  targetRef?: RefObject<HTMLDivElement>;
  imageRef: RefObject<HTMLDivElement>;
  slide: Slide;
  takeScreenshot?: () => void;
  numberOfVisPanes?: number;
  numberOfContentPanes?: number;
  vertical?: boolean;
  increaseNumberOfContentPanes: () => void;
  desktop?: boolean;
  timescale?: boolean;
  layout: PanelLayout;
}

interface DropProps {
  type: string;
  static: boolean;
  props: object;
}

export function SlideEditor(props: SlideEditorProps) {
  const {
    slide,
    imageRef,
    layout,
    //desktop = false,
  } = props;
  const [openDialog, setOpenDialog] = useState(false);

  const [editElement, setEditElement] = useState<any | null>(null);

  const dispatch = useAppDispatch();

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleSave = (element: any) => {
    dispatch(editSlideContent({ slide: slide, content: element }));
  };

  const windows = useAppSelector(selectWindows);

  const onSwitchVisualization = (
    targetSlot: string,
    targetVis: string | null,
    sourceSlot: string,
    sourceVis: string | null,
  ) => {
    dispatch(switchVisualizations({ targetSlot, targetVis, sourceSlot, sourceVis, slide }));
  };

  const onAddContentPane = (slotId: string) => {
    const contId = `contentPane-${Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .substring(0, 4)}`;

    dispatch(setContentPaneToSlot({ id: contId, slotId: slotId, slide }));
    dispatch(createContentPane({ id: contId }));
  };

  const onDropContentPane = (i_layout: any, i_layoutItem: any, event: any, i_targetPane: any) => {
    const dropProps: DropProps = JSON.parse(event.dataTransfer.getData('text'));

    const layoutItem = i_layoutItem;

    let targetPane = i_targetPane;
    if (targetPane === undefined) {
      targetPane = 'contentPane0';
    }

    const ids = windows.map((window: UiWindow) => {
      return window.i;
    });

    let counter = 1;
    const text = dropProps.type;
    let newText = text;
    while (ids.includes(newText)) {
      newText = text + ' (' + counter + ')';
      counter++;
    }
    layoutItem['i'] = newText;
    layoutItem['type'] = dropProps.type;

    switch (dropProps.type) {
      case 'Image':
        layoutItem['h'] = 4;
        layoutItem['w'] = 1;
        break;
      default:
        layoutItem['h'] = 1;
        layoutItem['w'] = 1;
        break;
    }

    dispatch(
      addContentToContentPane({
        story: slide.story,
        slide: slide.id,
        contentPane: targetPane,
        layout: {
          x: layoutItem['x'],
          y: layoutItem['y'],
          w: layoutItem['w'],
          h: layoutItem['h'],
        },
        type: layoutItem['type'],
        key: newText,
      }),
    );
  };

  return (
    /* innerref={imageRef} */
    // className={styles['slide-editor-wrapper']}
    <div ref={imageRef} className="h-full">
      {/* {createSplitterLayout()} */}
      <VisualizationGroup
        layout={layout}
        visualizationSlots={slide.visualizationSlots}
        contentPaneSlots={slide.contentPaneSlots}
        onAddVisualization={(visSlot: string, visId: string) => {
          dispatch(
            setVisualizationForVisualizationSlotForStorySlide({
              slide: slide,
              visualizationSlot: visSlot,
              visualizationId: visId,
            }),
          );
        }}
        onReleaseVisualization={(visSlot: string) => {
          dispatch(
            releaseVisualizationForVisualizationSlotForSlide({
              slide: slide,
              visSlot: visSlot,
            }),
          );
        }}
        onSwitchVisualization={onSwitchVisualization}
        onAddContentPane={onAddContentPane}
        onDropContentPane={onDropContentPane}
        setEditElement={setEditElement}
        setOpenDialog={setOpenDialog}
      />
      {editElement != null && (
        <StoryContentDialog
          open={openDialog}
          onClose={handleClose}
          element={editElement}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
