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
import StroyCreatorToolbar from '@/features/storycreator/story-creator-toolbar';
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
}

export function StoryCenterPane(props: StoryCenterPaneProps): JSX.Element {
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
          switchLayout(key);
        }
      }
    }
  };

  return (
    <div style={{ position: 'relative', height: `100%`, width: `100%` }}>
      <StroyCreatorToolbar onLayoutSelected={onLayoutSelected} />
      {selectedSlide?.layout}
    </div>
  );
}
