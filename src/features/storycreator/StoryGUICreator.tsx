import '~/node_modules/react-grid-layout/css/styles.css';
import '~/node_modules/react-resizable/css/styles.css';

import AdjustIcon from '@mui/icons-material/Adjust';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import LinearScaleOutlinedIcon from '@mui/icons-material/LinearScaleOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { toPng } from 'html-to-image';
import { useRef } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import ReactResizeDetector from 'react-resize-detector';

import { useAppDispatch, useAppSelector } from '@/features/common/store';
import SlideEditor from '@/features/storycreator/SlideEditor';
import styles from '@/features/storycreator/storycreator.module.css';
import { selectSlidesByStoryID, setImage } from '@/features/storycreator/storycreator.slice';
import StoryFlow from '@/features/storycreator/StoryFlow';

import { selectEntitiesByKind } from '../common/entities.slice';

const ResponsiveGridLayout = WidthProvider(Responsive);

const iconMap = {
  Timeline: <LinearScaleOutlinedIcon fontSize="large" key="timelineIcon" />,
  Map: <MapOutlinedIcon fontSize="large" key="mapIcon" />,
  Annotation: <NoteAltOutlinedIcon fontSize="large" key="annotationIcon" />,
  Image: <ImageOutlinedIcon fontSize="large" key="imageIcon" />,
  Person: <PersonOutlineOutlinedIcon fontSize="large" key="personIcon" />,
  Event: <AdjustIcon fontSize="large" key="EventIcon" />,
};

const createDrops = (type, props = {}) => {
  function getIcon(t) {
    return <div style={{ verticalAlign: 'middle', display: 'inline-block' }}>{iconMap[t]}</div>;
  }

  const content = [getIcon(type)];

  let text = '';
  const subline = '';
  let padding = 0;
  switch (type) {
    case 'Person':
      text = props.name;
      padding = 5;
      break;
    case 'Event':
      text = props.type;
      subline = `in ${props.place.name} in ${props.date.substring(0, 4)}`;
      padding = 5;
      break;
    default:
      text = type;
      padding = 30;
      break;
  }

  content.push(
    <div
      key="imageLabel"
      style={{
        verticalAlign: 'middle',
        paddingLeft: '10px',
        display: 'inline-block',
      }}
    >
      {text}
      <br />
      {subline}
    </div>,
  );

  return (
    <div
      key={type + 'Drop'}
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
      }}
    >
      {content}
    </div>
  );
};

export default function StoryCreator(props): JSX.Element {
  const story = props.story;

  const dispatch = useAppDispatch();

  const slides = useAppSelector((state) => {
    return selectSlidesByStoryID(state, story.i);
  });

  const filteredSlides = slides.filter((s) => {
    return s.selected;
  });
  const selectedSlide = filteredSlides[0] ? filteredSlides[0] : slides[0];

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
  const persons = Object.values(entitiesByKind.person)
    .map((person) => {
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
    })
    .slice(0, 1);

  return (
    <ResponsiveGridLayout
      className="layout"
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 1, sm: 1, xs: 1, xxs: 1 }}
      isDraggable={false}
    >
      <div
        key="gridWindowContent"
        className={styles['story-editor-pane']}
        data-grid={{
          x: 2,
          y: 0,
          w: 8,
          h: 4,
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
                persons={persons}
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
          h: 4,
        }}
      >
        <div style={{ overflow: 'hidden', width: '100%', height: '100%', overflowY: 'scroll' }}>
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
          h: 4,
        }}
      >
        {[
          createDrops('Map'),
          createDrops('Timeline'),
          createDrops('Annotation'),
          createDrops('Image'),
        ]}
      </div>
      <div
        key="gridWindowBottom"
        className={styles['story-editor-pane']}
        data-grid={{
          x: 0,
          y: 8,
          w: 12,
          h: 2,
        }}
      >
        <ReactResizeDetector handleWidth handleHeight>
          {({ width, height, targetRef }) => {
            return <StoryFlow targetRef={targetRef} width={width} height={height} story={story} />;
          }}
        </ReactResizeDetector>
      </div>
    </ResponsiveGridLayout>
  );
}
