import { useAppDispatch, useAppSelector } from '@/features/common/store';
import styles from '@/features/storycreator/storycreator.module.css';
import {
  addContent,
  editContent,
  removeContent,
  selectContentBySlide
} from '@/features/storycreator/storycreator.slice';
import StoryMap from '@/features/storycreator/StoryMap';
import uiStyles from '@/features/ui/ui.module.css';
import { selectWindows } from '@/features/ui/ui.slice';
import Window from '@/features/ui/Window';
import { Card, CardContent, CardMedia, TextareaAutosize, Typography } from '@mui/material';
import { useEffect } from 'react';
import ReactGridLayout from 'react-grid-layout';


interface Layout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  static: boolean;
  isDraggable: boolean;
  content: string;
}

interface DropProps {
  type: string;
  static: boolean;
  props: any;
}

const rowHeight = 30;
const height = 400;

export default function SlideEditor(props: any) {
  const myWidth = props.width;
  const targetRef = props.targetRef;
  const slide = props.slide;
  const imageRef = props.imageRef;
  const takeScreenshot = props.takeScreenshot;
  const persons = props.persons;
  const events = props.events;

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

  const eventDescriptions = events?
    .map((e) => {
      return e.description;
    });

  const eventMarkers = events?
    .map((e) => {
      return [parseFloat(e.place.lng), parseFloat(e.place.lat)];
    })
    .filter(Boolean) as Array<[number, number]>;

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
      case 'Annotation':
        layoutItem['h'] = 3;
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
  };

  const createWindowContent = (element: any) => {
    switch (element.type) {
      case 'Annotation':
        return (
          <TextareaAutosize
            aria-label="minimum height"
            minRows={3}
            style={{
              width: '100%',
              height: '100%',
              minWidth: '100%',
              minHeight: '100%',
              border: 'none',
              resize: 'none',
            }}
            placeholder={element.key}
          >
            {eventDescriptions?.join("")}
            </TextareaAutosize>
        );
      case 'Image':
        return (
          <Card
            style={{
              height: '100%',
              maxHeight: '100%',
              position: 'relative',
              backgroundColor: "white",
              padding: 0
            }}
          >
            <CardMedia
              style={{ height: '85%', width: '100%' }}
              image="https://upload.wikimedia.org/wikipedia/commons/7/74/Peter_Pavel_Vergerij.jpg"
              title="Vergerio"
            />
            <CardContent className={styles['card-content']}>
              <Typography gutterBottom variant="h5" component="h2">
                Pier Paolo Vergerio
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
              Pier (also: Pietro) Paolo Vergerio (c. 1498 – October 4, 1565) (Latin: Vergerius, Slovene: Peter Pavel Vergerius mlajši, also spelled Vergerij), the Younger, was an Italian papal nuncio and later Protestant reformer. Although at first opposed to Primož Trubar, the consolidator of Slovene as a language, he later supported him and was his mentor for some time.[1] He also contributed to the development of Croatian literature.
              </Typography>
            </CardContent>
          </Card>
        );
      case 'Timeline':
        //return <TimelineExample data={[]} />;
        return [];
      case 'Map':
        return <StoryMap markers={eventMarkers}></StoryMap>;
      default:
        return [];
    }
  };

  const createLayoutPane = (element: any) => {
    switch (element.type) {
      case 'Annotation':
      case 'Image':
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
          dispatch(editContent({ ...resized, story: slide.story, slide: slide.i }));
        }}
        onDragStop={(iLayout, element, dragged) => {
          dispatch(editContent({ ...dragged, story: slide.story, slide: slide.i }));
        }}
      >
        {content.map((e: any) => {
          return createLayoutPane(e);
        })}
      </ReactGridLayout>
    </div>
  );
}
