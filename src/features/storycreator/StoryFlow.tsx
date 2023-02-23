/* eslint-disable jsx-a11y/no-static-element-interactions */
import type { RefObject } from 'react';
import ReactGridLayout from 'react-grid-layout';

import { useAppDispatch } from '@/app/store';
import type { Slide, Story } from '@/features/storycreator/storycreator.slice';
import {
  copySlide,
  moveSlides,
  removeSlide,
  selectSlide,
} from '@/features/storycreator/storycreator.slice';
import { Window } from '@/features/ui/Window';
// FIXME: height unused
interface StoryFlowProps {
  width: number | undefined;
  height: number | undefined;
  targetRef: RefObject<HTMLElement> | undefined;
  story: Story;
  slides: Record<string, Slide>;
  vertical?: boolean;
}

export function StoryFlow(props: StoryFlowProps) {
  const { story, slides, vertical = false, width, height, targetRef } = props;

  const dispatch = useAppDispatch();

  const sortedSlides = Object.values(slides).sort((a, b) => {
    return a.sort - b.sort;
  });
  const layout = generateLayout(Object.values(slides));

  function generateLayout(i_slides: Array<Slide>) {
    const newSlides = [...i_slides].sort((a, b) => {
      return a.sort - b.sort;
    });

    const newLayout = [];
    let y = 0;
    let x = 0;
    for (const i in newSlides) {
      const s = newSlides[parseInt(i)]!;
      newLayout.push({ i: s.id, x: x, y: y, w: 1, h: 1, id: s.id });

      if (vertical) {
        y = y + 1;
      } else {
        x = x + 1;
        if ((parseInt(i) + 1) % 8 === 0) {
          x = 0;
          y = y + 1;
        }
      }
    }

    return newLayout;
  }

  function onClick(slideID: Slide['id']) {
    dispatch(selectSlide({ story: story.id, slide: slideID }));
  }

  function onRemove(slideID: Slide['id']) {
    dispatch(removeSlide({ story: story.id, slide: slideID }));
  }

  function onCopy(slideID: Slide['id']) {
    dispatch(copySlide({ story: story.id, slide: slideID }));
  }

  function onLayoutChange(layout: any) {
    const newSlides = { ...slides };
    for (const sLayout of layout) {
      if (newSlides[sLayout.i] !== undefined) {
        newSlides[sLayout.i] = { ...newSlides[sLayout.i], sort: sLayout.y } as Slide;
      }
    }

    dispatch(moveSlides({ story: story.id, slides: newSlides }));
  }

  return (
    <div
    /* className={styles['slide-editor-wrapper']} */
    /* ref={targetRef as RefObject<HTMLDivElement>} */
    >
      <ReactGridLayout
        onLayoutChange={onLayoutChange}
        innerRef={targetRef as RefObject<HTMLDivElement>}
        className="layout"
        layout={layout}
        rowHeight={130}
        width={width}
        cols={vertical ? 1 : 8}
        compactType={vertical ? 'vertical' : 'horizontal'}
        isResizable={false}
        useCSSTransforms={true}
        style={{ height: `${height}px`, maxHeight: `${height}px` }}
      >
        {sortedSlides.map((slide: Slide) => {
          return (
            <div
              key={slide.id}
              onClick={() => {
                onClick(slide.id);
              }}
              className={`cursor-pointer overflow-hidden rounded-md border ${
                slide.selected ?? true
                  ? 'border-[3px] border-intavia-blue-900'
                  : 'border-intavia-gray-400'
              }`}
              onKeyUp={() => {
                onClick(slide.id);
              }}
            >
              <Window
                id={`slide-window-${slide.id}`}
                title={`${slide.id}`}
                onRemoveWindow={() => {
                  onRemove(slide.id);
                }}
                onCopyWindow={() => {
                  onCopy(slide.id);
                }}
              >
                {slide.image !== null && (
                  <img className="block h-full w-auto" src={slide.image} alt={'ScreenShot'} />
                )}
              </Window>
            </div>
          );
        })}
      </ReactGridLayout>
    </div>
  );
}
