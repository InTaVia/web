import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import type { RefObject } from 'react';
import { useEffect, useState } from 'react';
import ReactGridLayout from 'react-grid-layout';

import { useAppDispatch, useAppSelector } from '@/features/common/store';
import { StoryContentDialog } from '@/features/storycreator/StoryContentDialog';
import styles from '@/features/storycreator/storycreator.module.css';
import type { Slide, StoryContent, StoryImage } from '@/features/storycreator/storycreator.slice';
import {
  addContent,
  addEntityToSlide,
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
  //FIXME: use real types for storyevents and persons!
  entities: Array<any>;
}

export function SlideEditor(props: SlideEditorProps) {
  const { width: myWidth, targetRef, slide, imageRef, entities, takeScreenshot } = props;

  const persons = entities.filter((entity: any) => {
    return entity.kind === 'person';
  });

  const events = entities.filter((entity: any) => {
    return entity.type === 'event';
  });

  const personMarkers = persons.flatMap((person) => {
    const history = person.history;
    return history
      ?.map((event: any) => {
        return [event.place?.lng, event.place?.lat];
      })
      .filter(Boolean) as Array<[number, number]>;
  });

  const eventMarkers = events
    .map((e) => {
      return [e.place?.lng, e.place?.lat];
    })
    .filter(Boolean) as Array<[number, number]>;

  /* const content = Object.values(slide.content); */
  const content = useAppSelector((state) => {
    return selectContentBySlide(state, slide);
  });

  useEffect(() => {
    takeScreenshot();
  }, [content, takeScreenshot]);

  const dispatch = useAppDispatch();

  const windows = useAppSelector(selectWindows);

  const removeWindowHandler = (id: string) => {
    dispatch(removeContent({ i: id, story: slide.story, slide: slide.i }));
  };

  const onDrop = (i_layout: any, i_layoutItem: any, event: any) => {
    const dropProps: DropProps = JSON.parse(event.dataTransfer.getData('text'));
    const layoutItem = i_layoutItem;

    if (dropProps.type === 'Event' || dropProps.type === 'Person') {
      dispatch(addEntityToSlide({ slide: slide, entity: { ...dropProps.props } }));
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
          slide: slide.i,
          x: layoutItem['x'],
          y: layoutItem['y'],
          w: layoutItem['w'],
          h: layoutItem['h'],
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
    const newElement = { ...element };
    for (const tar of event.target) {
      if (tar.type === 'text') {
        newElement[tar.id] = tar.value;
      }
    }
    event.target.reset();
    dispatch(editContent(newElement));
  };

  const createWindowContent = (element: StoryContent) => {
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
              {(Boolean(element.title) || Boolean(element.text)) && (
                <CardContent className={styles['card-content']}>
                  {Boolean(element.title) && (
                    <Typography gutterBottom variant="h5" component="h2">
                      {element.title}
                    </Typography>
                  )}
                  {Boolean(element.text) && (
                    <Typography variant="body2" color="textSecondary" component="p">
                      {element.text}
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
                image={(element as StoryImage).link}
                alt="card image"
                height="100%"
              />
            </div>
            {(element.title !== '' || element.text !== '') && (
              <CardContent className={styles['card-content']}>
                {element.title !== '' && (
                  <Typography gutterBottom variant="h5" component="h2">
                    {element.title}
                  </Typography>
                )}
                {element.text !== '' && (
                  <Typography variant="body2" color="textSecondary" component="p">
                    {element.text}
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
        return <StoryMap markers={[...eventMarkers, ...personMarkers]}></StoryMap>;
      default:
        return [];
    }
  };

  const createLayoutPane = (element: any) => {
    switch (element.type) {
      case 'Text':
      case 'Image':
        return (
          <div key={element.i} className={styles.elevated}>
            <Window
              className={styles['annotation-window']}
              title={element.type}
              id={element.i}
              onRemoveWindow={() => {
                removeWindowHandler(element.i);
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
          <div key={element.i} className={styles.elevated}>
            <Window
              className={styles['annotation-window']}
              title={element.type}
              id={element.i}
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
          <div key={element.i} className={styles.elevated}>
            <Window
              className={styles['annotation-window']}
              title={element.type}
              id={element.i}
              onRemoveWindow={() => {
                removeWindowHandler(element.i);
              }}
            >
              {element.key}
            </Window>
          </div>
        );
    }
  };

  return (
    <div ref={targetRef} className={styles['slide-editor-wrapper']}>
      <ReactGridLayout
        innerRef={imageRef}
        className="layout"
        layout={content}
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
          dispatch(resizeMoveContent({ ...resized, story: slide.story, slide: slide.i }));
        }}
        onDragStop={(iLayout, element, dragged) => {
          dispatch(resizeMoveContent({ ...dragged, story: slide.story, slide: slide.i }));
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
