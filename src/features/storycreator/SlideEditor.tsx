import type { Entity, Event } from '@intavia/api-client';
import { Dialog } from '@intavia/ui';
import type { DragEvent, RefObject } from 'react';
import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store';
import { ComponentPropertiesDialog } from '@/features/common/component-properties-dialog';
import type { DataTransferData } from '@/features/common/data-transfer.types';
import { ContentTypeTransferData, type as mediaType } from '@/features/common/data-transfer.types';
import type { Visualization } from '@/features/common/visualization.slice';
import { editVisualization } from '@/features/common/visualization.slice';
import type { SlideContent } from '@/features/storycreator/contentPane.slice';
import {
  createContentPane,
  editSlideContent,
  SlideContentTypes,
} from '@/features/storycreator/contentPane.slice';
import type { Slide } from '@/features/storycreator/storycreator.slice';
import {
  releaseVisualizationForVisualizationSlotForSlide,
  selectSlidesByStoryID,
  setContentPaneToSlot,
  setHighlighted,
  setVisualizationForVisualizationSlotForStorySlide,
  switchVisualizations,
} from '@/features/storycreator/storycreator.slice';
import type { PanelLayout } from '@/features/ui/analyse-page-toolbar/layout-popover';
import VisualizationGroup, {
  layoutTemplates,
} from '@/features/visualization-layouts/visualization-group';

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
    checkForEmptyContentPaneSlots,
  } = props;

  const [editElement, setEditElement] = useState<any | null>(null);

  const dispatch = useAppDispatch();

  const slides = useAppSelector((state) => {
    return selectSlidesByStoryID(state, slide.story);
  });

  const currentSlide = slides.filter((currSlide) => {
    return currSlide.id === slide.id;
  })[0];
  const highlighted = currentSlide?.highlighted ?? {};

  const handleClose = () => {
    setEditElement(null);
  };

  const handleSave = (element: SlideContent | Visualization) => {
    if (SlideContentTypes.includes(element.type)) {
      dispatch(editSlideContent({ content: element }));
    } else {
      dispatch(editVisualization(element));
    }
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
    try {
      const data = event.dataTransfer.getData(ContentTypeTransferData);
      const payload: DataTransferData = JSON.parse(data);
      addContent(payload.contentType, i_layoutItem, i_targetPane);
    } catch {
      try {
        const data = event.dataTransfer.getData(mediaType);
        const payload: DataTransferData = JSON.parse(data);
        if (payload.type === 'data') {
          if (payload.entities.length === 1 && payload.events.length === 0) {
            addContent('entity', i_layoutItem, i_targetPane);
          }
        }
      } catch {
        /** Ignore invalid json. */
      }
    }
  };

  const onContentPaneWizard = (i_layout: any, type: string, i_targetPane: any) => {
    addContent(type, i_layout, i_targetPane);
  };

  const allowDrop = (event: DragEvent) => {
    event.preventDefault();
  };

  const drop = (event: DragEvent) => {
    event.preventDefault();

    const data = event.dataTransfer.getData(ContentTypeTransferData);
    try {
      const payload: DataTransferData = JSON.parse(data);
      if (payload.type === 'contentType') {
        if (SlideContentTypes.includes(payload.contentType)) {
          increaseNumberOfContentPanes(payload.contentType);
        }
      }
    } catch {
      /** Ignore invalid json. */
    }
  };

  useEffect(() => {
    if (currentSlide != null) {
      checkForEmptyContentPaneSlots(layoutTemplates[currentSlide.layout]);
    }
  }, [currentSlide]);

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
        setVisualizationEditElement={setEditElement}
        hightlighted={highlighted}
        onToggleHighlight={(
          entities: Array<Entity['id'] | null>,
          events: Array<Event['id'] | null>,
          visId: string,
        ) => {
          dispatch(setHighlighted({ entities, events, visId, slide }));
        }}
        handleSaveComponent={handleSave}
      />

      {editElement !== null ? (
        <Dialog open={editElement !== null} onOpenChange={handleClose}>
          <ComponentPropertiesDialog
            onClose={handleClose}
            element={editElement}
            onSave={handleSave}
          />
        </Dialog>
      ) : null}
    </div>
  );
}
