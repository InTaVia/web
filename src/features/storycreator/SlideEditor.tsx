import type { DragEvent, RefObject } from 'react';
import { useState } from 'react';

import { useAppDispatch } from '@/app/store';
import { createContentPane, editSlideContent } from '@/features/storycreator/contentPane.slice';
import { StoryContentDialog } from '@/features/storycreator/StoryContentDialog';
import type { Slide } from '@/features/storycreator/storycreator.slice';
import {
  releaseVisualizationForVisualizationSlotForSlide,
  setContentPaneToSlot,
  setVisualizationForVisualizationSlotForStorySlide,
  switchVisualizations,
} from '@/features/storycreator/storycreator.slice';
import type { PanelLayout } from '@/features/ui/analyse-page-toolbar/layout-popover';
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
  increaseNumberOfContentPanes: (contentType: string | undefined) => void;
  desktop?: boolean;
  timescale?: boolean;
  layout: PanelLayout;
  addContent: (type: string, i_layoutItem: any, i_targetPane: string | undefined) => void;
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
    increaseNumberOfContentPanes,
    addContent,
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

    addContent(dropProps.type, i_layoutItem, i_targetPane);
  };

  const onContentPaneWizard = (i_layout: any, type: string, i_targetPane: any) => {
    addContent(type, i_layout, i_targetPane);
  };

  const allowDrop = (event: DragEvent) => {
    event.preventDefault();
  };

  const drop = (event: DragEvent) => {
    event.preventDefault();
    const data = JSON.parse(event.dataTransfer.getData('Text'));
    if (['Text', 'Image', 'Quiz'].includes(data.type)) {
      increaseNumberOfContentPanes(data.type);
    }
  };

  return (
    <div ref={imageRef} onDrop={drop} onDragOver={allowDrop} className="h-full">
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
        onContentPaneWizard={onContentPaneWizard}
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
