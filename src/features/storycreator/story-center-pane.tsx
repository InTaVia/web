import '~/node_modules/react-grid-layout/css/styles.css';
import '~/node_modules/react-resizable/css/styles.css';

import { toPng } from 'html-to-image';
import { useRef } from 'react';
import ReactResizeDetector from 'react-resize-detector';

import { useAppDispatch, useAppSelector } from '@/app/store';
import type { ContentSlotId } from '@/features/storycreator/contentPane.slice';
import { createContentPane } from '@/features/storycreator/contentPane.slice';
import { SlideEditor } from '@/features/storycreator/SlideEditor';
import StroyCreatorToolbar from '@/features/storycreator/story-creator-toolbar';
import type { Slide, Story } from '@/features/storycreator/storycreator.slice';
import {
  selectSlidesByStoryID,
  setContentPaneToSlot,
  setImage,
  setLayoutForSlide,
} from '@/features/storycreator/storycreator.slice';
import type { PanelLayout } from '@/features/ui/analyse-page-toolbar/layout-popover';
import type {
  LayoutPaneContent,
  LayoutTemplateItem,
} from '@/features/visualization-layouts/visualization-group';
import { layoutTemplates } from '@/features/visualization-layouts/visualization-group';

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

  const addContentPane = (slotId: string) => {
    const contId = `contentPane-${Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .substring(0, 4)}`;

    dispatch(setContentPaneToSlot({ id: contId, slotId: slotId, slide: selectedSlide }));
    dispatch(createContentPane({ id: contId }));
  };

  const checkForEmptyContentPaneSlots = (layoutTemplate: any) => {
    for (const [key, value] of Object.entries(layoutTemplate)) {
      if (key !== 'cols' && key !== 'rows') {
        if (layoutTemplate.type === 'contentPane') {
          const contentPaneSlots = selectedSlide!.contentPaneSlots;
          const slotId = layoutTemplate.id as ContentSlotId;
          if (contentPaneSlots[slotId] === null) {
            addContentPane(layoutTemplate.id);
          }
        }
      } else {
        (value as Array<LayoutTemplateItem>).map((item: LayoutTemplateItem) => {
          checkForEmptyContentPaneSlots(item);
        });
      }
    }
  };

  const onLayoutSelected = (i_layout: PanelLayout) => {
    checkForEmptyContentPaneSlots(layoutTemplates[i_layout] as LayoutPaneContent);
    dispatch(setLayoutForSlide({ slide: selectedSlide, layout: i_layout }));
  };

  const increaseNumberOfContentPanes = () => {
    /* if (numberOfContentPanes === 0) {
      for (const key of Object.keys(SlideLayouts)) {
        const layout = SlideLayouts[key];
        if (layout!.numberOfContentPanes === 1) {
          dispatch(setLayoutForSlide({ slide: selectedSlide, layout: key }));
        }
      }
    }
 */
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
                  layout={selectedSlide!.layout}
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
