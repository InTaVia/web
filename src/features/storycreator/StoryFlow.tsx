import { Button, Card, CardContent } from '@mui/material';
import ReactGridLayout from 'react-grid-layout';

import { useAppDispatch } from '@/features/common/store';
import styles from '@/features/storycreator/storycreator.module.css';

import { createSlide } from './storycreator.slice';

export default function StoryFlow(props: any) {
  const myWidth = props.width;
  const targetRef = props.targetRef;
  const story = props.story;

  const dispatch = useAppDispatch();

  const slides = story.slides;

  const layout = generateLayout(slides);

  function generateLayout(i_slides) {
    const newSlides = [...i_slides].sort((a, b) => {
      return a.sort - b.sort;
    });

    const newLayout = [];
    let y = 0;
    let x = 0;
    for (const i in newSlides) {
      //let s = newSlides[i];
      newLayout.push({ i: `slide${i}`, x: x, y: y, w: 1, h: 1 });
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

  return (
    <div ref={targetRef} className={styles['slide-editor-wrapper']}>
      <ReactGridLayout
        className="layout"
        layout={layout}
        rowHeight={30}
        cols={8}
        autoSize={true}
        width={myWidth}
        compactType="horizontal"
        isResizable={false}
        useCSSTransforms={true}
      >
        {slides.map((e: any, i: number) => {
          return (
            <Card key={`slide${i}`} sx={{ minWidth: 50 }}>
              <CardContent>{e.content}</CardContent>
            </Card>
          );
        })}
      </ReactGridLayout>
      <Button
        onClick={() => {
          dispatch(createSlide({ story: story.i, content: 'c' }));
        }}
      >
        Add Slide
      </Button>
    </div>
  );
}
