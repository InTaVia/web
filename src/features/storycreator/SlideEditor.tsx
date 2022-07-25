import { Allotment } from 'allotment';
import type { RefObject } from 'react';
import { useState } from 'react';
import ReactResizeDetector from 'react-resize-detector';

import { useAppDispatch, useAppSelector } from '@/app/store';
import { StoryContentDialog } from '@/features/storycreator/StoryContentDialog';
import { StoryContentPane } from '@/features/storycreator/StoryContentPane';
import type { Slide } from '@/features/storycreator/storycreator.slice';
import {
  addContentToContentPane,
  editSlideContent,
} from '@/features/storycreator/storycreator.slice';
import { StoryVisPane } from '@/features/storycreator/StoryVisPane';
import type { UiWindow } from '@/features/ui/ui.slice';
import { selectWindows } from '@/features/ui/ui.slice';

interface SlideEditorProps {
  width?: number | undefined;
  height?: number | undefined; // FIXME: unused
  targetRef?: RefObject<HTMLDivElement>;
  /* imageRef: RefObject<HTMLDivElement>; */
  slide: Slide;
  takeScreenshot?: () => void;
  numberOfVisPanes: number;
  numberOfContentPanes: number;
  vertical?: boolean;
  increaseNumberOfContentPanes: () => void;
  desktop?: boolean;
  timescale?: boolean;
}

interface DropProps {
  type: string;
  static: boolean;
  props: object;
}

export function SlideEditor(props: SlideEditorProps) {
  const {
    targetRef,
    slide,
    /* imageRef, */
    numberOfContentPanes,
    numberOfVisPanes,
    vertical = false,
    increaseNumberOfContentPanes,
    //desktop = false,
    timescale = false,
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
        layoutItem['h'] = 4;
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

  const createSplitterLayout = () => {
    const visKeys = Object.keys(slide.visualizationPanes) as Array<string>;
    const visualizations = [];
    for (let i = 0; i < numberOfVisPanes; i++) {
      visualizations.push(slide.visualizationPanes[visKeys[i] as string]);
    }

    const contentPanesInSlide = Object.values(slide.contentPanes);
    const contents = [];

    for (let i = 0; i < numberOfContentPanes; i++) {
      contents.push(contentPanesInSlide[i]);
    }

    const visPanes = visualizations.map((vis: any, index: number) => {
      return (
        <ReactResizeDetector key={`vis${index}`} handleWidth handleHeight>
          {({ width, height, targetRef }) => {
            return (
              <StoryVisPane
                id={vis !== undefined ? vis.id : `vis${index}`}
                targetRef={targetRef as RefObject<HTMLDivElement>}
                width={width}
                height={height}
                setEditElement={setEditElement}
                setOpenDialog={setOpenDialog}
                slide={slide}
                visualization={vis}
                increaseNumberOfContentPane={increaseNumberOfContentPanes}
                dropContent={onDropContentPane}
              />
            );
          }}
        </ReactResizeDetector>
      );
    });

    const contentPanes = contents.map((pane: any, index: number) => {
      return (
        <ReactResizeDetector key={`contentPane${index}`} handleWidth handleHeight>
          {({ width, height, targetRef }) => {
            return (
              <StoryContentPane
                id={pane !== undefined ? pane.id : `contentPane${index}`}
                contentPane={pane}
                targetRef={targetRef as RefObject<HTMLDivElement>}
                width={width}
                height={height}
                setEditElement={setEditElement}
                setOpenDialog={setOpenDialog}
                slide={slide}
                onDrop={onDropContentPane}
              />
            );
          }}
        </ReactResizeDetector>
      );
    });

    return (
      <Allotment vertical={true}>
        <Allotment.Pane>
          <Allotment>
            <Allotment.Pane visible={visPanes.length > 0 ? true : false}>
              <Allotment
                key={`alottmentForVis${vertical}`}
                /* Force the layout to repaint */ vertical={vertical ? false : true}
              >
                {visPanes.map((vis, index) => {
                  return <Allotment.Pane key={index}>{vis}</Allotment.Pane>;
                })}
              </Allotment>
            </Allotment.Pane>
            <Allotment.Pane preferredSize={'33%'} visible={contentPanes.length > 0 ? true : false}>
              <Allotment
                key={`alottmentForContent${vertical}`} //Force the layout to repaint
                vertical={vertical ? false : true}
              >
                {contentPanes.map((content, index) => {
                  return <Allotment.Pane key={index}>{content}</Allotment.Pane>;
                })}
              </Allotment>
            </Allotment.Pane>
          </Allotment>
        </Allotment.Pane>
        <Allotment.Pane maxSize={50} key={`${timescale}`} visible={timescale}>
          <div className="h-full w-full bg-intavia-red-200" />
        </Allotment.Pane>
      </Allotment>
    );
  };

  return (
    /* innerref={imageRef} */
    // className={styles['slide-editor-wrapper']}
    <div ref={targetRef} className="h-full">
      {createSplitterLayout()}
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
