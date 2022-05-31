import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import type { RefObject } from 'react';
import { useEffect, useState } from 'react';
import ReactGridLayout from 'react-grid-layout';

import { useAppDispatch, useAppSelector } from '@/features/common/store';
import { StoryContentDialog } from '@/features/storycreator/StoryContentDialog';
import styles from '@/features/storycreator/storycreator.module.css';
import type {
  Slide,
  SlideContent,
  StoryEvent,
  StoryImage,
} from '@/features/storycreator/storycreator.slice';
import {
  addContent,
  addEventsToSlide,
  addEventToSlide,
  editContent,
  removeContent,
  resizeMoveContent,
  selectContentBySlide,
} from '@/features/storycreator/storycreator.slice';
import { StoryMap } from '@/features/storycreator/StoryMap';
import uiStyles from '@/features/ui/ui.module.css';
import type { UiWindow } from '@/features/ui/ui.slice';
import { selectWindows } from '@/features/ui/ui.slice';
import { Window } from '@/features/ui/Window';

import type { Person } from '../common/entity.model';

interface DropProps {
  type: string;
  static: boolean;
  props: object;
}

const rowHeight = 30;
const height = 400;

interface SlideEditorProps {
  width: number | undefined;
  height: number | undefined; // FIXME: unused
  targetRef: RefObject<HTMLDivElement>;
  imageRef: RefObject<HTMLDivElement>;
  slide: Slide;
  takeScreenshot: () => void;
  events: Array<StoryEvent>; //FIXME: use real types for storyevents and persons!
}

export function SlideEditor(props: SlideEditorProps) {
  const { width: myWidth, targetRef, slide, imageRef, events, takeScreenshot } = props;

  const content = useAppSelector((state) => {
    return selectContentBySlide(state, slide);
  });

  useEffect(() => {
    takeScreenshot();
  }, [content, takeScreenshot]);

  const dispatch = useAppDispatch();

  const windows = useAppSelector(selectWindows);

  const removeWindowHandler = (id: string) => {
    dispatch(removeContent({ id: id, story: slide.story, slide: slide.id }));
  };

  const onDrop = (i_layout: any, i_layoutItem: any, event: any) => {
    const dropProps: DropProps = JSON.parse(event.dataTransfer.getData('text'));
    const layoutItem = i_layoutItem;

    if (dropProps.type === 'Event') {
      dispatch(addEventToSlide({ slide: slide, event: { ...dropProps.props } }));
    } else if (dropProps.type === 'Person') {
      const person = dropProps.props as Person;
      if (person.history !== undefined) {
        dispatch(addEventsToSlide({ slide: slide, events: [...person.history] }));
      }
    } else {
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
        case 'Text':
        case 'Quiz':
          layoutItem['h'] = 4;
          layoutItem['w'] = 2;
          break;
        case 'Image':
          layoutItem['h'] = 12;
          layoutItem['w'] = 3;
          break;
        case 'Timeline':
          layoutItem['h'] = 12;
          layoutItem['w'] = 3;
          break;
        case 'Map':
          layoutItem['h'] = height / rowHeight;
          layoutItem['w'] = 48;
          layoutItem['x'] = 0;
          layoutItem['y'] = 0;

          if (dropProps.static as boolean) {
            layoutItem['x'] = 0;
            layoutItem['y'] = 0;
            layoutItem['static'] = true;
            layoutItem['isDraggable'] = false;
          }
          break;

        default:
          layoutItem['x'] = 0;
          layoutItem['y'] = 0;
          layoutItem['h'] = 2;
          layoutItem['w'] = 2;
          break;
      }

      dispatch(
        addContent({
          story: slide.story,
          slide: slide.id,
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
    }
  };

  const [openDialog, setOpenDialog] = useState(false);

  const [editElement, setEditElement] = useState<any | null>(null);

  const handleClose = () => {
    setOpenDialog(false);
  };

  //FIXME: use real type for event and element
  const handleSave = (event: any, element: any) => {
    event.preventDefault();
    const newProperties = { ...element.properties };
    console.log(event);
    for (const tar of event.target) {
      console.log(tar, Object.keys(tar));
      newProperties[tar.id] = { ...newProperties[tar.id], value: tar.value };
    }
    event.target.reset();
    dispatch(editContent({ ...element, properties: newProperties }));
  };

  const createWindowContent = (element: SlideContent) => {
    switch (element.type) {
      case 'Text':
        return (
          <div style={{ height: '100%' }}>
            <Card
              style={{
                height: '100%',
                maxHeight: '100%',
                position: 'relative',
                backgroundColor: 'white',
                padding: 0,
              }}
            >
              {(Boolean(element.properties.title?.value) ||
                Boolean(element.properties.text?.value)) && (
                <CardContent className={styles['card-content']}>
                  {Boolean(element.properties.title?.value) && (
                    <Typography gutterBottom variant="h5" component="h2">
                      {element.properties.title?.value}
                    </Typography>
                  )}
                  {Boolean(element.properties.text?.value) && (
                    <Typography variant="subtitle1" color="subtitle1" component="p">
                      {element.properties.text?.value}
                    </Typography>
                  )}
                </CardContent>
              )}
            </Card>
          </div>
        );
      case 'Image':
        return (
          <Card
            style={{
              height: '100%',
              maxHeight: '100%',
              position: 'relative',
              backgroundColor: 'white',
              padding: 0,
            }}
          >
            <div style={{ height: '100%' }}>
              <CardMedia
                component="img"
                image={
                  (element as StoryImage).properties.link?.value !== ''
                    ? (element as StoryImage).properties.link?.value
                    : 'https://via.placeholder.com/300'
                }
                alt="card image"
                height="100%"
              />
            </div>
            {(element.properties.title?.value !== '' || element.properties.text?.value !== '') && (
              <CardContent className={styles['card-content']}>
                {element.properties.title?.value !== '' && (
                  <Typography gutterBottom variant="h5" component="h2">
                    {element.properties.title?.value}
                  </Typography>
                )}
                {element.properties.text?.value !== '' && (
                  <Typography variant="subtitle1" color="textSecondary" component="p">
                    {element.properties.text?.value}
                  </Typography>
                )}
              </CardContent>
            )}
          </Card>
        );
      case 'Timeline':
        //return <TimelineExample data={[]} />;
        return [];
      case 'Map':
        return <StoryMap events={events}></StoryMap>;
      default:
        return [];
    }
  };

  const createLayoutPane = (element: any) => {
    switch (element.type) {
      case 'Text':
      case 'Image':
      case 'Quiz':
        return (
          <div key={element.id} className={styles.elevated}>
            <Window
              className={styles['annotation-window']}
              title={element.type}
              id={element.id}
              onRemoveWindow={() => {
                removeWindowHandler(element.id);
              }}
              onEditContent={() => {
                setEditElement(element);
                setOpenDialog(true);
              }}
              static={element.static}
              isDraggable={true}
            >
              {createWindowContent(element)}
            </Window>
          </div>
        );
      case 'Map':
        return (
          <div key={element.id} className={styles.elevated}>
            <Window
              className={styles['annotation-window']}
              title={element.type}
              id={element.id}
              onRemoveWindow={() => {
                removeWindowHandler(element.i);
              }}
              static={element.static}
              isDraggable={true}
            >
              {createWindowContent(element)}
            </Window>
          </div>
        );
      default:
        return (
          <div key={element.id} className={styles.elevated}>
            <Window
              className={styles['annotation-window']}
              title={element.type}
              id={element.id}
              onRemoveWindow={() => {
                removeWindowHandler(element.id);
              }}
            >
              {element.key}
            </Window>
          </div>
        );
    }
  };

  const layout = content.map((content) => {
    return { i: content.id, ...content.layout };
  });

  return (
    <div ref={targetRef} className={styles['slide-editor-wrapper']}>
      <ReactGridLayout
        innerRef={imageRef}
        className="layout"
        layout={layout}
        rowHeight={30}
        cols={12}
        width={myWidth}
        allowOverlap={true}
        isDroppable={true}
        compactType={null}
        useCSSTransforms={true}
        preventCollision={false}
        draggableHandle={'.' + uiStyles['header-area']}
        style={{
          width: '100%',
          height: '100%',
        }}
        onDrop={onDrop}
        onResizeStop={(iLayout, element, resized) => {
          dispatch(
            resizeMoveContent({ ...resized, story: slide.story, slide: slide.id, id: resized.i }),
          );
        }}
        onDragStop={(iLayout, element, dragged) => {
          dispatch(
            resizeMoveContent({ ...dragged, story: slide.story, slide: slide.id, id: dragged.i }),
          );
        }}
      >
        {content.map((e: any) => {
          return createLayoutPane(e);
        })}
      </ReactGridLayout>
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
