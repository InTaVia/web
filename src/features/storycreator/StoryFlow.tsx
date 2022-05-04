import { Button, Card } from '@mui/material';
import ReactGridLayout from 'react-grid-layout';

import { useAppDispatch, useAppSelector } from '@/features/common/store';
import styles from '@/features/storycreator/storycreator.module.css';
import type { Slide } from '@/features/storycreator/storycreator.slice';
import {
  copySlide,
  createSlide,
  removeSlide,
  selectSlide,
  selectSlidesByStoryId,
} from '@/features/storycreator/storycreator.slice';
import { Window } from '@/features/ui/Window';

interface StoryFlowProps {
  width?: number;
  height?: number; // FIXME: unused currently
  targetRef: any;
  story: any;
}

export function StoryFlow(props: StoryFlowProps): JSX.Element {
  const myWidth = props.width;
  const targetRef = props.targetRef;
  const story = props.story;

  const dispatch = useAppDispatch();

  const slides = useAppSelector((state) => {
    return selectSlidesByStoryId(state, story.id);
  });

  const layout = generateLayout(slides);

  function generateLayout(i_slides: any) {
    const newSlides = [...i_slides].sort((a, b) => {
      return a.sort - b.sort;
    });

    const newLayout = [];
    let y = 0;
    let x = 0;
    for (const i in newSlides) {
      const s = newSlides[parseInt(i)];
      newLayout.push({ i: 'slide' + s.i, x: x, y: y, w: 1, h: 1 });
      x = x + 1;

      if ((parseInt(i) + 1) % 8 === 0) {
        x = 0;
        y = y + 1;
      }
    }

    return newLayout;
  }

  // function onAdd() {
  //   dispatch(createSlide({ story: story.id, content: 'c' }));
  // }

  function onClick(slideID: Slide['i']) {
    dispatch(selectSlide({ story: story.id, slide: slideID }));
  }

  function onRemove(slideID: Slide['i']) {
    dispatch(removeSlide({ story: story.id, slide: slideID }));
  }

  function onCopy(slideID: Slide['i']) {
    dispatch(copySlide({ story: story.id, slide: slideID }));
  }

  return (
    <div ref={targetRef} className={styles['slide-editor-wrapper']}>
      <ReactGridLayout
        className="layout"
        layout={layout}
        rowHeight={120}
        cols={8}
        autoSize={true}
        width={myWidth}
        compactType="horizontal"
        isResizable={false}
        useCSSTransforms={true}
      >
        {slides.map((slide: any) => {
          return (
            <Card
              key={'slide' + slide.i}
              onClick={() => {
                onClick(slide.i);
              }}
              className={`${styles['story-flow-card']} ${
                slide.selected === true ? styles['selected'] : ''
              }`}
            >
              <Window
                id={slide.i}
                title={slide.i}
                onRemoveWindow={() => {
                  onRemove(slide.i);
                }}
                onCopyWindow={() => {
                  onCopy(slide.i);
                }}
              >
                {slide.image !== null && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img style={{ height: '100%' }} src={slide.image} alt={'ScreenShot'} />
                )}
              </Window>
            </Card>
          );
        })}
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
