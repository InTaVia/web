import { Card } from '@mui/material';
import type { RefObject } from 'react';
import ReactGridLayout from 'react-grid-layout';

import { useAppDispatch } from '@/features/common/store';
import styles from '@/features/storycreator/storycreator.module.css';
import type { Slide, Story } from '@/features/storycreator/storycreator.slice';
import { copySlide, removeSlide, selectSlide } from '@/features/storycreator/storycreator.slice';
import { Window } from '@/features/ui/Window';

// FIXME: height unused
interface StoryFlowProps {
  width: number | undefined;
  height: number | undefined;
  targetRef: RefObject<HTMLElement> | undefined;
  story: Story;
}

export function StoryFlow(props: StoryFlowProps) {
  const { width: myWidth, targetRef, story } = props;

  const dispatch = useAppDispatch();

  /* const slides = useAppSelector((state) => {
    return selectSlidesByStoryID(state, story.i);
  }); */

  const slides = Object.values(story.slides);

  const layout = generateLayout(slides);

  function generateLayout(i_slides: Array<Slide>) {
    const newSlides = [...i_slides].sort((a, b) => {
      return a.sort - b.sort;
    });

    const newLayout = [];
    let y = 0;
    let x = 0;
    for (const i in newSlides) {
      const s = newSlides[parseInt(i)]!;
      newLayout.push({ i: 'slide' + s.i, x: x, y: y, w: 1, h: 1 });
      x = x + 1;

      if ((parseInt(i) + 1) % 8 === 0) {
        x = 0;
        y = y + 1;
      }
    }

    return newLayout;
  }

  function onClick(slideID: Slide['i']) {
    dispatch(selectSlide({ story: story.i, slide: slideID }));
  }

  function onRemove(slideID: Slide['i']) {
    dispatch(removeSlide({ story: story.i, slide: slideID }));
  }

  function onCopy(slideID: Slide['i']) {
    dispatch(copySlide({ story: story.i, slide: slideID }));
  }

  return (
    <div
      ref={targetRef as RefObject<HTMLDivElement>}
      className={styles['slide-editor-wrapper']}
      style={{ overflow: 'hidden', overflowY: 'scroll' }}
    >
      <ReactGridLayout
        className="layout"
        layout={layout}
        rowHeight={120}
        cols={8}
        width={myWidth}
        compactType="horizontal"
        isResizable={false}
        useCSSTransforms={true}
      >
        {slides.map((slide: Slide) => {
          return (
            <Card
              key={'slide' + slide.i}
              onClick={() => {
                onClick(slide.i);
              }}
              className={`${styles['story-flow-card']} ${
                slide.selected ?? true ? styles['selected'] : ''
              }`}
            >
              <Window
                id={`slide-window-${slide.i}`}
                title={slide.title != null ? slide.title : slide.i}
                onRemoveWindow={() => {
                  onRemove(slide.i);
                }}
                onCopyWindow={() => {
                  onCopy(slide.i);
                }}
              >
                {slide.image !== null && (
                  <img style={{ height: '100%' }} src={slide.image} alt={'ScreenShot'} />
                )}
              </Window>
            </Card>
          );
        })}
      </ReactGridLayout>
    </div>
  );
}
