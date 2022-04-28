import '~/node_modules/react-resizable/css/styles.css';
import '~/node_modules/react-grid-layout/css/styles.css';

import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import LinearScaleOutlinedIcon from '@mui/icons-material/LinearScaleOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import { Responsive, WidthProvider } from 'react-grid-layout';
import ReactResizeDetector from 'react-resize-detector';

import { useAppSelector } from '@/features/common/store';
import SlideEditor from '@/features/storycreator/SlideEditor';
import styles from '@/features/storycreator/storycreator.module.css';
import { selectStoryByID } from '@/features/storycreator/storycreator.slice';
import StoryFlow from '@/features/storycreator/StoryFlow';

const ResponsiveGridLayout = WidthProvider(Responsive);

const createDrops = (type, props = {}) => {
  function getContent(t) {
    let content = [];
    switch (t) {
      case 'Timeline':
        content = [
          <LinearScaleOutlinedIcon fontSize="large" key="timelineIcon"></LinearScaleOutlinedIcon>,
        ];
        break;
      case 'Map':
        content = [<MapOutlinedIcon fontSize="large" key="mapIcon"></MapOutlinedIcon>];
        break;
      case 'Annotation':
        content = [
          <NoteAltOutlinedIcon fontSize="large" key="annotationIcon"></NoteAltOutlinedIcon>,
        ];
        break;
      case 'Image':
        content = [
          <ImageOutlinedIcon fontSize="large" key="imageIcon">
            Image
          </ImageOutlinedIcon>,
        ];
        break;
    }

    content.push(
      <div
        key="imageLabel"
        style={{
          verticalAlign: 'top',
          paddingLeft: '10px',
          display: 'inline-block',
          lineHeight: '30px',
        }}
      >
        {t}
      </div>,
    );

    return <div>{content}</div>;
  }

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
        margin: 10,
        padding: 30,
        cursor: 'pointer',
      }}
    >
      {getContent(type)}
    </div>
  );
};

export default function StoryCreatorPage(props): JSX.Element {
  const storyID = props.storyID;

  const story = useAppSelector((state) => {
    return selectStoryByID(state, storyID);
  });

  return (
    <div className={styles['story-editor-wrapper']}>
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
              return <SlideEditor targetRef={targetRef} width={width} height={height} />;
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
          {[createDrops('Map', { static: true }), createDrops('Timeline', { static: true })]}
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
          {[createDrops('Annotation'), createDrops('Image'), createDrops('Timeline')]}
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
              return (
                <StoryFlow targetRef={targetRef} width={width} height={height} story={story} />
              );
            }}
          </ReactResizeDetector>
        </div>
      </ResponsiveGridLayout>
    </div>
  );
}
