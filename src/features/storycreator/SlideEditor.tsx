import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import ReactGridLayout from 'react-grid-layout';

import { useAppDispatch, useAppSelector } from '@/features/common/store';
import styles from '@/features/storycreator/storycreator.module.css';
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
import { selectWindows } from '@/features/ui/ui.slice';
import { Window } from '@/features/ui/Window';

import { StoryContentDialog } from './StoryContentDialog';

// interface Layout {
//   i: string;
//   x: number;
//   y: number;
//   w: number;
//   h: number;
//   static: boolean;
//   isDraggable: boolean;
//   content: string;
// }

interface DropProps {
  type: string;
  static: boolean;
  props: any;
}

const rowHeight = 30;
const height = 400;

export function SlideEditor(props: any) {
  const myWidth = props.width;
  const targetRef = props.targetRef;
  const slide = props.slide;
  const imageRef = props.imageRef;
  const takeScreenshot = props.takeScreenshot;

  const entities = props.entities;

  const persons = entities.filter((e) => {
    return e.kind === 'person';
  });
  const events = entities.filter((e) => {
    return e.kind === 'event';
  });

  const personMarkers = persons?.flatMap((p) => {
    const historyEventsWithLocation = p.history.filter((e) => {
      return e.place.lat && e.place.lng;
    });

    return historyEventsWithLocation
      .map((e) => {
        return [parseFloat(e.place.lng), parseFloat(e.place.lat)];
      })
      .filter(Boolean) as Array<[number, number]>;
  });

  const eventDescriptions = events?.map((e) => {
    return e.description;
  });

  const eventMarkers = events
    ?.map((e) => {
      return [parseFloat(e.place.lng), parseFloat(e.place.lat)];
    })
    .filter(Boolean) as Array<[number, number]>;

  /* const content = Object.values(slide.content); */
  const content = useAppSelector((state) => {
    return selectContentBySlide(state, slide);
  });

  useEffect(() => {
    takeScreenshot();
  }, [content]);

  const dispatch = useAppDispatch();

  const windows = useAppSelector(selectWindows);

  const removeWindowHandler = (id: any) => {
    dispatch(removeContent({ i: id, story: slide.story, slide: slide.i }));
  };

  const onDrop = (i_layout, i_layoutItem, event) => {
    const dropProps: DropProps = JSON.parse(event.dataTransfer.getData('text'));
    const layoutItem = i_layoutItem;

    if (dropProps.type === 'Event' || dropProps.type === 'Person') {
      dispatch(addEntityToSlide({ slide: slide, entity: { ...dropProps.props } }));
    } else {
      const ids = windows.map((e: any) => {
        return e.key;
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

          if (dropProps.props.static as boolean) {
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

  const [editElement, setEditElement] = useState(null);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const onTextfieldChange = (newElement) => {
    dispatch(editContent(newElement));
  };

  const handleSave = (event, element) => {
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

  const createWindowContent = (element: any) => {
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
              {(element.title || element.text) && (
                <CardContent className={styles['card-content']}>
                  {element.title && (
                    <Typography gutterBottom variant="h5" component="h2">
                      {element.title ? element.title : 'Title'}
                    </Typography>
                  )}
                  {element.text && (
                    <Typography variant="body2" color="textSecondary" component="p">
                      {element.text ? element.text : 'Text'}
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
                  element.link
                    ? element.link
                    : 'https://socialistmodernism.com/wp-content/uploads/2017/07/placeholder-image-300x225.png'
                }
                alt="card image"
                height="100%"
              />
            </div>
            {(element.title || element.text) && (
              <CardContent className={styles['card-content']}>
                {element.title && (
                  <Typography gutterBottom variant="h5" component="h2">
                    {element.title ? element.title : 'Title'}
                  </Typography>
                )}
                {element.text && (
                  <Typography variant="body2" color="textSecondary" component="p">
                    {element.text ? element.text : 'Text'}
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
        measureBeforeMount={false}
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
      {editElement && (
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
