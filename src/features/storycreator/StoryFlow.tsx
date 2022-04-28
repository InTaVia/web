import { Button, Card, CardContent } from '@mui/material';
import ReactGridLayout from 'react-grid-layout';

import { useAppDispatch, useAppSelector } from '@/features/common/store';
import styles from '@/features/storycreator/storycreator.module.css';

import { createSlide, selectSlide, selectSlidesByStoryID } from './storycreator.slice';

export default function StoryFlow(props: any) {
  const myWidth = props.width;
  const targetRef = props.targetRef;
  const story = props.story;

  const dispatch = useAppDispatch();

  const slides = useAppSelector((state) => {
    return selectSlidesByStoryID(state, story.i);
  });

  const layout = generateLayout(slides);

  function generateLayout(i_slides) {
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

  function onAdd() {
    dispatch(createSlide({ story: story.i, content: 'c' }));
  }

  function onClick(slideID) {
    dispatch(selectSlide({ story: story.i, slide: slideID }));
  }

  return (
    <div ref={targetRef} className={styles['slide-editor-wrapper']}>
      <ReactGridLayout
        className="layout"
        layout={layout}
        rowHeight={80}
        cols={8}
        autoSize={true}
        width={myWidth}
        compactType="horizontal"
        isResizable={false}
        useCSSTransforms={true}
      >
        {slides.map((e: any, i: number) => {
          return (
            <Card
              onClick={(event) => {
                onClick(e.i);
              }}
              className={`${styles['story-flow-card']} ${e.selected ? styles['selected'] : ''}`}
              key={'slide' + e.i}
              sx={{ minWidth: 50 }}
            >
              <CardContent>{e.i}</CardContent>
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
