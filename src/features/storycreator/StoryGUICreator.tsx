import '~/node_modules/react-grid-layout/css/styles.css';
import '~/node_modules/react-resizable/css/styles.css';

import { Button } from '@mui/material';
import { toPng } from 'html-to-image';
import type { RefObject } from 'react';
import { useRef } from 'react';
import ReactGridLayout from 'react-grid-layout';
import ReactResizeDetector from 'react-resize-detector';

import { selectEntitiesByKind } from '@/features/common/entities.slice';
import type { Place } from '@/features/common/entity.model';
import { useAppDispatch, useAppSelector } from '@/features/common/store';
import { DroppableIcon } from '@/features/storycreator/DroppableIcon';
import { SlideEditor } from '@/features/storycreator/SlideEditor';
import styles from '@/features/storycreator/storycreator.module.css';
import type { Story } from '@/features/storycreator/storycreator.slice';
import {
  createSlide,
  createSlidesInBulk,
  selectSlidesByStoryID,
  setImage,
} from '@/features/storycreator/storycreator.slice';
import { StoryFlow } from '@/features/storycreator/StoryFlow';

interface DropProps {
  name?: string | null;
  title?: string | null;
  type?: string;
  place?: Place | null;
  date?: IsoDateString;
}

//FIXME: correct type of props!
const createDrops = (props: DropProps = {}) => {
  const { type } = props;
  // eslint-disable-next-line react/jsx-key
  const content = [<DroppableIcon type={type} />];

  let text = '';
  let subline = '';
  let padding = 0;
  let key = `${type}Drop`;
  switch (type) {
    case 'Person':
      if (props.name != null) {
        text = props.name;
      }
      key = key + props.name;
      padding = 5;
      break;
    case 'Event':
      if (props.name != null) {
        text = props.name;
      } else {
        text = type;
      }

      key = key + JSON.stringify(props);
      if (props.place != null) {
        subline = `in ${props.place.name}`;
      }
      if (props.date !== undefined && props.date !== '') {
        subline += ` in ${props.date.substring(0, 4)}`;
      }
      padding = 5;
      break;
    default:
      if (type !== undefined) {
        text = type;
      }
      padding = 5;
      break;
  }

  content.push(
    <div
      key="imageLabel"
      style={{
        verticalAlign: 'middle',
        paddingLeft: '10px',
        display: 'table-cell',
      }}
    >
      {text}
      <br />
      {subline}
    </div>,
  );

  return (
    <div
      key={key}
      className="droppable-element"
      draggable={true}
      unselectable="on"
      onDragStart={(e) => {
        return e.dataTransfer.setData(
          'text/plain',
          JSON.stringify({
            type: type,
            props: props,
            content: '',
          }),
        );
      }}
      style={{
        border: 'solid 1px black',
        padding: padding,
        marginBottom: 10,
        cursor: 'pointer',
        display: 'table',
        width: '100%',
      }}
    >
      <div style={{ display: 'table-row', width: '100%' }}>{content}</div>
    </div>
  );
};

interface StoryGUICreatorProps {
  targetRef: RefObject<HTMLElement>;
  width: number;
  height: number;
  story: Story;
}

export function StoryGUICreator(props: StoryGUICreatorProps): JSX.Element {
  const { story, height, width, targetRef: parentRef } = props;

  const dispatch = useAppDispatch();

  const slides = useAppSelector((state) => {
    return selectSlidesByStoryID(state, story.i);
  });

  const filteredSlides = slides.filter((s) => {
    return s.selected;
  });
  const selectedSlide = filteredSlides.length > 0 ? filteredSlides[0] : slides[0];

  const ref = useRef<HTMLDivElement>(null);

  const takeScreenshot = function () {
    if (ref.current === null) {
      return;
    }

    toPng(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        dispatch(setImage({ slide: selectedSlide, image: dataUrl }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const entitiesByKind = useAppSelector(selectEntitiesByKind);
  const persons = Object.values(entitiesByKind.person);

  if (persons.length === 1 && slides.length === 0) {
    const newSlides = [];
    const person = persons[0];
    if (person?.history !== undefined) {
      const history = [...person.history] as Array<any>;
      //FIXME: use real types for events/relations
      const sortedHistory = history.sort((a: any, b: any) => {
        return parseInt(a.date.substring(0, 4)) - parseInt(b.date.substring(0, 4));
      });
      for (const event of sortedHistory) {
        newSlides.push({
          story: story.i,
          title: event.name,
          entities: [event],
          content: [
            {
              x: 0,
              y: 0,
              w: 12,
              h: 13,
              type: 'Map',
              key: 'Map',
            },
            {
              x: 9,
              y: 8,
              w: 2,
              h: 4,
              type: 'Text',
              key: 'Text',
              text: event.description,
            },
          ],
        });
      }

      dispatch(createSlidesInBulk({ story: story, newSlides: newSlides }));
    }
  }

  const entitiesInSlide = selectedSlide?.entities ? selectedSlide.entities : persons;

  const gridHeight = Math.round(height / 5);

  return (
    <div ref={parentRef} style={{ height: '100%', width: '100%', maxHeight: '100%' }}>
      <ReactGridLayout
        className="layout"
        isDraggable={false}
        cols={12}
        rowHeight={gridHeight}
        width={width}
      >
        <div
          key="gridWindowContent"
          className={styles['story-editor-pane']}
          style={{ height, width }}
          data-grid={{
            x: 2,
            y: 1,
            w: 8,
            h: 3,
          }}
        >
          {selectedSlide !== undefined && (
            <ReactResizeDetector handleWidth handleHeight>
              {({ width, height, targetRef }) => {
                return (
                  <SlideEditor
                    targetRef={targetRef}
                    width={width as number}
                    height={height as number}
                    slide={selectedSlide}
                    imageRef={ref}
                    takeScreenshot={takeScreenshot}
                    entities={entitiesInSlide}
                  />
                );
              }}
            </ReactResizeDetector>
          )}
        </div>
        <div
          key="gridWindowLeft"
          className={styles['story-editor-pane']}
          data-grid={{
            x: 0,
            y: 0,
            w: 2,
            h: 3,
          }}
        >
          <div
            style={{
              overflow: 'hidden',
              width: '100%',
              height: '100%',
              overflowY: 'scroll',
            }}
          >
            {/* FIXME: use real types */}
            {persons.length > 1
              ? persons.map((person: any) => {
                  return createDrops({ ...person, type: 'Person' });
                })
              : persons.map((person: any) => {
                  return [...person.history]
                    .sort((a, b) => {
                      return parseInt(a.date.substring(0, 4)) - parseInt(b.date.substring(0, 4));
                    })
                    .map((element: any) => {
                      return createDrops({ ...element, type: 'Event' });
                    });
                })}
          </div>
        </div>
        <div
          key="gridWindowRight"
          className={styles['story-editor-pane']}
          data-grid={{
            x: 10,
            y: 0,
            w: 2,
            h: 3,
          }}
        >
          {[
            createDrops({ type: 'Map' }),
            /* createDrops('Timeline'), */
            createDrops({ type: 'Text' }),
            createDrops({ type: 'Image' }),
            /* createDrops('Quiz'), */
          ]}
        </div>
        <div
          key="gridWindowBottom"
          className={styles['story-editor-pane']}
          data-grid={{
            x: 0,
            y: 4,
            w: 12,
            h: 1,
          }}
        >
          <ReactResizeDetector handleWidth handleHeight>
            {({ width, height, targetRef }) => {
              return (
                <StoryFlow targetRef={targetRef} width={width} height={height} story={story} />
              );
            }}
          </ReactResizeDetector>
        </div>
      </ReactGridLayout>
      <Button
        onClick={() => {
          dispatch(createSlide(story.i));
        }}
      >
        Add Slide
      </Button>
    </div>
  );
}
