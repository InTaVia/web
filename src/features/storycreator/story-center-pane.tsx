import '~/node_modules/react-grid-layout/css/styles.css';
import '~/node_modules/react-resizable/css/styles.css';

import { toPng } from 'html-to-image';
import { useRef } from 'react';
import ReactResizeDetector from 'react-resize-detector';

import { useAppDispatch, useAppSelector } from '@/app/store';
import { SlideEditor } from '@/features/storycreator/SlideEditor';
import StroyCreatorToolbar from '@/features/storycreator/story-creator-toolbar';
import type { Slide, Story } from '@/features/storycreator/storycreator.slice';
import {
  selectSlidesByStoryID,
  setImage,
  setLayoutForSlide,
} from '@/features/storycreator/storycreator.slice';

/* interface DropProps {
  name?: string | null;
  title?: string | null;
  label?: string | null;
  type: string;
  place?: Place | null;
  date?: IsoDateString;
} */

export interface SlideLayout {
  numberOfVis: 0 | 1 | 2;
  numberOfContentPanes: 0 | 1 | 2;
  vertical: boolean;
}

export const SlideLayouts: Record<string, SlideLayout> = {
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

interface StoryCenterPaneProps {
  story: Story;
  desktop: boolean;
  onDesktopChange: (desktop: boolean) => void;
  timescale: boolean;
  onTimescaleChange: (timescale: boolean) => void;
}

export function StoryCenterPane(props: StoryCenterPaneProps): JSX.Element {
  const { story, desktop, onDesktopChange, timescale, onTimescaleChange } = props;

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

  const onLayoutSelected = (i_layout: string | null) => {
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
          dispatch(setLayoutForSlide({ slide: selectedSlide, layout: key }));
        }
      }
    }
  };

  return (
    <div className="grid  h-full w-full grid-rows-[max-content_1fr]">
      <StroyCreatorToolbar
        onLayoutSelected={onLayoutSelected}
        desktop={desktop}
        onDesktopChange={onDesktopChange}
        timescale={timescale}
        onTimescaleChange={onTimescaleChange}
      />
      <ReactResizeDetector key="test" handleWidth handleHeight>
        {({ width, height }) => {
          const aspectRatio = 3 / 4;
          let newWidth;
          if (height !== undefined) {
            newWidth = desktop ? width : aspectRatio * height;
          } else {
            newWidth = 'unset';
          }
          return (
            <div className="grid h-full w-full grid-cols-1 justify-items-center">
              <div className="h-full border border-intavia-gray-300" style={{ width: newWidth }}>
                <SlideEditor
                  slide={selectedSlide as Slide}
                  //imageRef={ref}
                  takeScreenshot={takeScreenshot}
                  numberOfVisPanes={numberOfVis}
                  numberOfContentPanes={numberOfContentPanes}
                  vertical={vertical}
                  desktop={desktop}
                  timescale={timescale}
                  increaseNumberOfContentPanes={increaseNumberOfContentPanes}
                />
              </div>
            </div>
          );
        }}
      </ReactResizeDetector>
    </div>
  );
}

{
  /* <div className={`h-full ${desktop ? 'w-full' : 'w-1/3'} border border-black`}>
          <SlideEditor
            slide={selectedSlide as Slide}
            //imageRef={ref}
            takeScreenshot={takeScreenshot}
            numberOfVisPanes={numberOfVis}
            numberOfContentPanes={numberOfContentPanes}
            vertical={vertical}
            desktop={desktop}
            timescale={timescale}
            increaseNumberOfContentPanes={increaseNumberOfContentPanes}
          />
        </div> */
}
