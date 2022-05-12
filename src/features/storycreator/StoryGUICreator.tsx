import '~/node_modules/react-grid-layout/css/styles.css';
import '~/node_modules/react-resizable/css/styles.css';

import AdjustIcon from '@mui/icons-material/Adjust';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import LinearScaleOutlinedIcon from '@mui/icons-material/LinearScaleOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import { Button } from '@mui/material';
import { toPng } from 'html-to-image';
import type { RefObject } from 'react';
import { useRef } from 'react';
import ReactGridLayout from 'react-grid-layout';
import ReactResizeDetector from 'react-resize-detector';

import { selectEntitiesByKind } from '@/features/common/entities.slice';
import { useAppDispatch, useAppSelector } from '@/features/common/store';
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

const iconMap = {
  Timeline: (
    <LinearScaleOutlinedIcon
      className={styles['droppable-icon']}
      fontSize="large"
      color="primary"
      key="timelineIcon"
    />
  ),
  Map: (
    <MapOutlinedIcon
      className={styles['droppable-icon']}
      fontSize="large"
      color="primary"
      key="mapIcon"
    />
  ),
  Text: (
    <NoteAltOutlinedIcon
      className={styles['droppable-icon']}
      fontSize="large"
      color="primary"
      key="annotationIcon"
    />
  ),
  Image: (
    <ImageOutlinedIcon
      className={styles['droppable-icon']}
      fontSize="large"
      color="primary"
      key="imageIcon"
    />
  ),
  Person: (
    <PersonOutlineOutlinedIcon
      className={styles['droppable-icon']}
      color="primary"
      key="personIcon"
    />
  ),
  Event: <AdjustIcon className={styles['droppable-icon']} color="primary" key="EventIcon" />,
  Quiz: (
    <QuizOutlinedIcon
      className={styles['droppable-icon']}
      fontSize="large"
      color="primary"
      key="EventIcon"
    />
  ),
};

const createDrops = (type, props = {}) => {
  function getIcon(t) {
    return (
      <div key={`icon${t}`} style={{ verticalAlign: 'middle', display: 'table-cell', width: '1%' }}>
        {iconMap[t]}
      </div>
    );
  }

  const content = [getIcon(type)];

  let text = '';
  const subline = '';
  let padding = 0;
  let key = `${type}Drop`;
  switch (type) {
    case 'Person':
      text = props.name;
      key = key + props.name;
      padding = 5;
      break;
    case 'Event':
      text = props.name ? props.name : props.type;
      key = key + JSON.stringify(props);
      subline = `in ${props.place.name}`;
      if (props.date !== '') {
        subline += ` in ${props.date.substring(0, 4)}`;
      }
      padding = 5;
      break;
    default:
      text = type;
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
  targetRef?: RefObject<HTMLElement>;
  width?: number;
  height?: number;
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
        //console.log(err);
      });
  };

  const entitiesByKind = useAppSelector(selectEntitiesByKind);
  const persons = Object.values(entitiesByKind.person).map((person) => {
    const newPerson = { ...person };
    const history = person.history?.filter((relation) => {
      return relation.type === 'beginning';
    });
    if (history != null) {
      newPerson.birthLocation = history.flatMap((relation) => {
        return [relation.place?.lng, relation.place?.lat];
      });
    }

    return newPerson;
  });

  if (persons.length === 1 && slides.length === 0) {
    const newSlides = [];
    const sortedHistory = [...persons[0]?.history].sort((a, b) => {
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
            text: event?.description,
          },
        ],
      });
    }

    dispatch(createSlidesInBulk({ story: story, newSlides: newSlides }));
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
          <ReactResizeDetector handleWidth handleHeight>
            {({ width, height, targetRef }) => {
              return (
                <SlideEditor
                  targetRef={targetRef}
                  width={width}
                  height={height}
                  slide={selectedSlide}
                  imageRef={ref}
                  takeScreenshot={takeScreenshot}
                  entities={entitiesInSlide}
                />
              );
            }}
          </ReactResizeDetector>
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
            {persons.length > 1
              ? persons.map((p, index) => {
                  return createDrops('Person', p);
                })
              : persons.map((p, index) => {
                  return [...p.history]
                    .sort((a, b) => {
                      return parseInt(a.date.substring(0, 4)) - parseInt(b.date.substring(0, 4));
                    })
                    .map((e) => {
                      return createDrops('Event', e);
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
            createDrops('Map'),
            /* createDrops('Timeline'), */
            createDrops('Text'),
            createDrops('Image'),
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
          dispatch(createSlide({ story: story.i }));
        }}
      >
        Add Slide
      </Button>
    </div>
  );
}