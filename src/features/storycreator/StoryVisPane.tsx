/* import type { RefObject } from 'react';
import { useEffect } from 'react';
import ReactGridLayout from 'react-grid-layout';

import { useAppDispatch, useAppSelector } from '@/app/store';
import type { EntityEvent, Person, StoryEvent } from '@/features/common/entity.model';
import { StoryTimeline } from '@/features/storycreator/story-timeline';
import styles from '@/features/storycreator/storycreator.module.css';
import type {
  Slide,
  SlideContent,
  StoryMap,
  VisualisationPane,
} from '@/features/storycreator/storycreator.slice';
import { addVisualization } from '@/features/storycreator/storycreator.slice';
import { StoryMapComponent } from '@/features/storycreator/StoryMap';
import type { UiWindow } from '@/features/ui/ui.slice';
import { selectWindows } from '@/features/ui/ui.slice';
import { Window } from '@/features/ui/Window';

interface DropProps {
  type: string;
  static: boolean;
  props: object;
}
const rowHeight = 30;
const margin: [number, number] = [0, 0];

interface StoryVisPaneProps {
  id: string;
  width: number | undefined;
  height: number | undefined;
  targetRef: RefObject<HTMLDivElement>;
  slide: Slide;
  setEditElement: (arg0: any) => void;
  setOpenDialog: (arg0: boolean) => void;
  increaseNumberOfContentPane: () => void;
  dropContent: (i_layout: any, i_layoutItem: any, event: any, targetPane: any) => void;
  visualization: VisualisationPane | undefined;
}

export function StoryVisPane(props: StoryVisPaneProps) {
  const {
    id,
    width: myWidth,
    height,
    targetRef,
    visualization,
    slide,
    increaseNumberOfContentPane,
    dropContent,
  } = props;

  const myHeight =
    height !== undefined ? Math.floor((height + margin[1]) / (rowHeight + margin[1])) : 12;

  const dispatch = useAppDispatch();

  const windows = useAppSelector(selectWindows);

  let events: Array<StoryEvent>;
  if (visualization !== undefined) {
    events = visualization.events;
  } else {
    events = [];
  }

  useEffect(() => {
    console.log('Updated Visualization');
  }, [visualization]);

  const removeWindowHandler = (element: SlideContent) => {
    dispatch(removeSlideContent({ slide: slide, parentPane: id, content: element }));
  };

  const onDrop = (i_layout: any, i_layoutItem: any, event: any) => {
    const dropProps: DropProps = JSON.parse(event.dataTransfer.getData('text'));
    const layoutItem = i_layoutItem;

    if (dropProps.type === 'Event') {
      dispatch(addEventToVisPane({ slide: slide, visPane: id, event: { ...dropProps.props } }));
    } else if (dropProps.type === 'Person') {
      const person = dropProps.props as Person;
      if (person.history !== undefined) {
        const newHistory = person.history.map((historyEvent: EntityEvent) => {
          return { ...historyEvent, targetId: person.id.toString() } as EntityEvent;
        });
        dispatch(addEventsToVisPane({ slide: slide, visPane: id, events: [...newHistory] }));
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
        case 'Timeline':
        case 'Map':
          layoutItem['h'] = myHeight;
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
        case 'Quiz':
        case 'Text':
        case 'Image':
          increaseNumberOfContentPane();
          dropContent(i_layout, i_layoutItem, event, undefined);
          return;
        default:
          layoutItem['x'] = 0;
          layoutItem['y'] = 0;
          layoutItem['h'] = 2;
          layoutItem['w'] = 2;
          break;
      }

      dispatch(
        addVisualization({
          story: slide.story,
          slide: slide.id,
          parentPane: id,
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

  const createWindowContent = (element: SlideContent) => {
    switch (element.type) {
      case 'Timeline':
        return <StoryTimeline events={events} persons={[]} />;
      case 'Map':
        return (
          <StoryMapComponent
            setMapBounds={(bounds: Array<Array<number>>) => {
              if ((element as StoryMap).bounds !== bounds) {
                dispatch(
                  editSlideContent({ slide: slide, content: { ...element, bounds: bounds } }),
                );
              }
            }}
            events={events}
          ></StoryMapComponent>
        );
      default:
        return [];
    }
  };

  const createLayoutPane = (element: any) => {
    switch (element.type) {
      case 'Timeline':
      case 'Map':
        return (
          <div key={element.id} className={styles.elevated}>
            <Window
              className={styles['annotation-window']}
              title={element.type}
              id={element.id}
              onRemoveWindow={() => {
                removeWindowHandler(element);
              }}
              static={true}
            >
              {createWindowContent(element)}
            </Window>
          </div>
        );
      default:
        return;
    }
  };

  let contents: Array<SlideContent> = [];
  if (visualization !== undefined) {
    contents = Object.values(visualization.contents);
  }

  const layout = contents.map((content) => {
    return { i: content.id, ...content.layout };
  });

  return (
    <div ref={targetRef} className={styles['slide-editor-wrapper']}>
      <ReactGridLayout
        className="layout"
        layout={layout}
        rowHeight={rowHeight}
        margin={margin}
        cols={12}
        width={myWidth}
        allowOverlap={true}
        isDroppable={true}
        compactType={null}
        useCSSTransforms={true}
        preventCollision={false}
        isDraggable={false}
        style={{
          width: '100%',
          height: '100%',
        }}
        onDrop={onDrop}
        onResizeStop={(iLayout, element, resized) => {
          dispatch(
            resizeMoveContent({
              layout: resized,
              slide: slide.id,
              story: slide.story,
              parentPane: id,
              content: element.i,
              parentType: 'Visualization',
            }),
          );
        }}
        onDragStop={(iLayout, element, dragged) => {
          dispatch(
            resizeMoveContent({
              layout: dragged,
              slide: slide.id,
              story: slide.story,
              parentPane: id,
              content: element.i,
              parentType: 'Visualization',
            }),
          );
        }}
      >
        {contents.map((content) => {
          return createLayoutPane(content);
        })}
      </ReactGridLayout>
    </div>
  );
}
 */

export function StoryVisPane() {
  return <></>;
}
