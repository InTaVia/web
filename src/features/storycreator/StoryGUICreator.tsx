import '~/node_modules/react-grid-layout/css/styles.css';
import '~/node_modules/react-resizable/css/styles.css';

import { Button, IconButton } from '@mui/material';
import { Allotment } from 'allotment';
import { toPng } from 'html-to-image';
import type { RefObject } from 'react';
import { useRef } from 'react';
import ReactResizeDetector from 'react-resize-detector';

import { useAppDispatch, useAppSelector } from '@/app/store';
import { selectEntitiesByKind } from '@/features/common/entities.slice';
import type { Place } from '@/features/common/entity.model';
import { DroppableIcon } from '@/features/storycreator/DroppableIcon';
import { SlideEditor } from '@/features/storycreator/SlideEditor';
import styles from '@/features/storycreator/storycreator.module.css';
import type { Slide, Story } from '@/features/storycreator/storycreator.slice';
import {
  createSlide,
  createSlidesInBulk,
  selectSlidesByStoryID,
  setImage,
  setLayoutForSlide,
} from '@/features/storycreator/storycreator.slice';
import { StoryFlow } from '@/features/storycreator/StoryFlow';

interface DropProps {
  name?: string | null;
  title?: string | null;
  label?: string | null;
  type: string;
  place?: Place | null;
  date?: IsoDateString;
}

interface SlideLayout {
  numberOfVis: 0 | 1 | 2;
  numberOfContentPanes: 0 | 1 | 2;
  vertical: boolean;
}

const SlideLayouts: Record<string, SlideLayout> = {
  singlevis: {
    numberOfVis: 1,
    numberOfContentPanes: 0,
    vertical: false,
  },
  twovisvertical: {
    numberOfVis: 2,
    numberOfContentPanes: 0,
    vertical: true,
  },
  twovishorizontal: {
    numberOfVis: 2,
    numberOfContentPanes: 0,
    vertical: false,
  },
  singleviscontent: {
    numberOfVis: 1,
    numberOfContentPanes: 1,
    vertical: false,
  },
  twoviscontenthorizontal: {
    numberOfVis: 2,
    numberOfContentPanes: 1,
    vertical: false,
  },
  twoviscontentvertical: {
    numberOfVis: 2,
    numberOfContentPanes: 1,
    vertical: true,
  },
  twocontents: {
    numberOfVis: 0,
    numberOfContentPanes: 2,
    vertical: true,
  },
};

const createDrops = (props: DropProps) => {
  const { type } = props;

  const content = [<DroppableIcon key={`${type}Icon`} type={type} />];
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
      if (props.label != null) {
        text = props.label;
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
          'Text',
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
  story: Story;
}

export function StoryGUICreator(props: StoryGUICreatorProps): JSX.Element {
  const { story } = props;

  const dispatch = useAppDispatch();

  const slides = useAppSelector((state) => {
    return selectSlidesByStoryID(state, story.id);
  });

  const filteredSlides = slides.filter((slide: Slide) => {
    return slide.selected;
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
  const persons = Object.values(entitiesByKind.person).slice(-1);

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
          story: story.id,
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

  /* const gridHeight = height !== undefined ? Math.round(height / 5) : 15; */

  const switchLayout = (i_layout: string | null) => {
    dispatch(setLayoutForSlide({ slide: selectedSlide, layout: i_layout }));
  };

  const { numberOfVis, numberOfContentPanes, vertical } = SlideLayouts[
    selectedSlide!.layout
  ] as SlideLayout;

  const increaseNumberOfContentPanes = () => {
    if (numberOfContentPanes === 0) {
      for (const key of Object.keys(SlideLayouts)) {
        const layout = SlideLayouts[key];
        if (
          layout!.numberOfContentPanes === 1 &&
          layout!.vertical === vertical &&
          layout!.numberOfVis === numberOfVis
        ) {
          switchLayout(key);
        }
      }
    }
  };

  return (
    <div style={{ position: 'relative', height: `100%`, width: `100%` }}>
      <div style={{ width: '100%', backgroundColor: 'honeydew' }}>
        <IconButton
          key={'singlevisLayoutButton'}
          color="primary"
          aria-label="upload picture"
          component="span"
          onClick={() => {
            switchLayout('singlevis');
          }}
        >
          <img src="/assets/images/singlevis.png" alt="Single Visualization" height="30px" />
        </IconButton>
        <IconButton
          key={'twovisverticalLayoutButton'}
          color="primary"
          aria-label="upload picture"
          component="span"
          onClick={() => {
            switchLayout('twovisvertical');
          }}
        >
          <img
            src="/assets/images/twovisvertical.png"
            alt="Two Visualization Vertical"
            height="30px"
          />
        </IconButton>
        <IconButton
          key={'twovishorizontalLayoutButton'}
          color="primary"
          aria-label="upload picture"
          component="span"
          onClick={() => {
            switchLayout('twovishorizontal');
          }}
        >
          <img
            src="/assets/images/twovishorizontal.png"
            alt="Two Visualization Horizontal"
            height="30px"
          />
        </IconButton>
        <IconButton
          key={'singleviscontentLayoutButton'}
          color="primary"
          aria-label="upload picture"
          component="span"
          onClick={() => {
            switchLayout('singleviscontent');
          }}
        >
          <img src="/assets/images/singleviscontent.png" alt="Single Content" height="30px" />
        </IconButton>
        <IconButton
          key={'twoviscontenthorizontalLayoutButton'}
          color="primary"
          aria-label="upload picture"
          component="span"
          onClick={() => {
            switchLayout('twoviscontenthorizontal');
          }}
        >
          <img
            src="/assets/images/twoviscontenthorizontal.png"
            alt="Two Visualization With Content"
            height="30px"
          />
        </IconButton>
        <IconButton
          key={'twoviscontentverticalLayoutButton'}
          color="primary"
          aria-label="upload picture"
          component="span"
          onClick={() => {
            switchLayout('twoviscontentvertical');
          }}
        >
          <img
            src="/assets/images/twoviscontentvertical.png"
            alt="Two Visualization With Content Vertical"
            height="30px"
          />
        </IconButton>
        <IconButton
          key={'twocontentsLayoutButton'}
          color="primary"
          aria-label="upload picture"
          component="span"
          onClick={() => {
            switchLayout('twocontents');
          }}
        >
          <img src="/assets/images/twocontents.png" alt="Two Content Panes" height="30px" />
        </IconButton>
      </div>
      <Allotment vertical={true}>
        <Allotment.Pane preferredSize="70%">
          <Allotment>
            <Allotment.Pane preferredSize="20%">
              <div className={styles['story-editor-pane']}>
                {persons.length > 1
                  ? persons.map((person: any) => {
                      return createDrops({ ...person, type: 'Person' });
                    })
                  : persons.map((person: any) => {
                      return [...person.history]
                        .sort((a, b) => {
                          return (
                            parseInt(a.date.substring(0, 4)) - parseInt(b.date.substring(0, 4))
                          );
                        })
                        .map((element: any) => {
                          return createDrops({ ...element, type: 'Event' });
                        });
                    })}
              </div>
            </Allotment.Pane>
            <Allotment.Pane preferredSize="60%">
              <ReactResizeDetector handleWidth handleHeight>
                {({ width, height, targetRef }) => {
                  return (
                    <SlideEditor
                      targetRef={targetRef as RefObject<HTMLDivElement>}
                      width={width}
                      height={height}
                      slide={selectedSlide as Slide}
                      /* imageRef={ref} */
                      takeScreenshot={takeScreenshot}
                      numberOfVisPanes={numberOfVis}
                      numberOfContentPanes={numberOfContentPanes}
                      vertical={vertical}
                      increaseNumberOfContentPanes={increaseNumberOfContentPanes}
                    />
                  );
                }}
              </ReactResizeDetector>
            </Allotment.Pane>
            <Allotment.Pane preferredSize="20%">
              <div className={styles['story-editor-pane']}>
                {[
                  createDrops({ type: 'Map' }),
                  createDrops({ type: 'Text' }),
                  createDrops({ type: 'Image' }),
                  createDrops({ type: 'Quiz' }),
                ]}
              </div>
            </Allotment.Pane>
          </Allotment>
        </Allotment.Pane>
        <Allotment.Pane preferredSize="30%">
          <ReactResizeDetector handleWidth handleHeight>
            {({ width, height, targetRef }) => {
              return (
                <StoryFlow targetRef={targetRef} width={width} height={height} story={story} />
              );
            }}
          </ReactResizeDetector>
        </Allotment.Pane>
        <Button
          onClick={() => {
            dispatch(createSlide(story.id));
          }}
        >
          Add Slide
        </Button>
      </Allotment>
    </div>
  );
}
