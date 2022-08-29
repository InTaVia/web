import '~/node_modules/react-grid-layout/css/styles.css';
import '~/node_modules/react-resizable/css/styles.css';

import { toPng } from 'html-to-image';
import { useRef } from 'react';
import ReactResizeDetector from 'react-resize-detector';
import type { StringLiteral } from 'typescript';

import { useAppDispatch, useAppSelector } from '@/app/store';
import type { ContentSlotId } from '@/features/storycreator/contentPane.slice';
import {
  addContentToContentPane,
  createContentPane,
} from '@/features/storycreator/contentPane.slice';
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
import type { UiWindow } from '@/features/ui/ui.slice';
import { selectWindows } from '@/features/ui/ui.slice';
import type {
  LayoutPaneContent,
  LayoutTemplateItem,
} from '@/features/visualization-layouts/visualization-group';
import { layoutTemplates } from '@/features/visualization-layouts/visualization-group';

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

  const setSlideThumbnail = function () {
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

  const addContentPane = (slotId: StringLiteral, contentToAddType: string | undefined) => {
    const contId = `contentPane-${Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .substring(0, 4)}`;

    dispatch(setContentPaneToSlot({ id: contId, slotId: slotId, slide: selectedSlide }));
    dispatch(createContentPane({ id: contId }));

    if (contentToAddType !== undefined) {
      addContent(contentToAddType, {}, contId);
    }
  };

  const checkForEmptyContentPaneSlots = (
    layoutTemplate: any,
    contentToAddType: string | undefined = undefined,
  ) => {
    for (const [key, value] of Object.entries(layoutTemplate)) {
      if (key !== 'cols' && key !== 'rows') {
        if (layoutTemplate.type === 'contentPane') {
          const contentPaneSlots = selectedSlide!.contentPaneSlots;
          const slotId = layoutTemplate.id as ContentSlotId;
          if (contentPaneSlots[slotId] === null) {
            addContentPane(layoutTemplate.id, contentToAddType);
          }
        }
      } else {
        (value as Array<LayoutTemplateItem>).map((item: LayoutTemplateItem) => {
          checkForEmptyContentPaneSlots(item, contentToAddType);
        });
      }
    }
  };

  const onLayoutSelected = (i_layout: PanelLayout) => {
    checkForEmptyContentPaneSlots(layoutTemplates[i_layout] as LayoutPaneContent);
    dispatch(setLayoutForSlide({ slide: selectedSlide, layout: i_layout }));
  };

  const windows = useAppSelector(selectWindows);

  const addContent = (type: string, i_layoutItem: any, i_targetPane: string | undefined) => {
    const layoutItem = i_layoutItem;

    let targetPane = i_targetPane;
    if (targetPane === undefined) {
      targetPane = 'contentPane0';
    }

    const ids = windows.map((window: UiWindow) => {
      return window.i;
    });

    let counter = 1;
    const text = type;
    let newText = text;
    while (ids.includes(newText)) {
      newText = text + ' (' + counter + ')';
      counter++;
    }
    layoutItem['i'] = newText;
    layoutItem['type'] = type;

    switch (type) {
      case 'Image':
        layoutItem['h'] = 4;
        layoutItem['w'] = 1;
        break;
      case 'Quiz':
        layoutItem['h'] = 2;
        layoutItem['w'] = 1;
        break;
      default:
        layoutItem['h'] = 1;
        layoutItem['w'] = 1;
        break;
    }

    dispatch(
      addContentToContentPane({
        story: selectedSlide?.story,
        slide: selectedSlide?.id,
        contentPane: targetPane,
        layout: {
          x: layoutItem['x'],
          y: layoutItem['y'],
          w: layoutItem['w'],
          h: layoutItem['h'],
        },
        type: layoutItem['type'],
        key: newText,
      }),
    );
  };

  const increaseNumberOfContentPanes = (contentToAddType: string | undefined) => {
    const layout = selectedSlide!.layout;

    const newLayout = (layout + '-content') as PanelLayout;
    if (Object.keys(layoutTemplates).includes(newLayout)) {
      checkForEmptyContentPaneSlots(
        layoutTemplates[newLayout] as LayoutPaneContent,
        contentToAddType,
      );
      dispatch(setLayoutForSlide({ slide: selectedSlide, layout: newLayout }));
    }
  };

  setSlideThumbnail();

  return (
    <div className="grid h-full w-full grid-rows-[max-content_1fr]">
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
                  imageRef={ref}
                  layout={selectedSlide!.layout}
                  desktop={desktop}
                  timescale={timescale}
                  increaseNumberOfContentPanes={increaseNumberOfContentPanes}
                  addContent={addContent}
                />
              </div>
            </div>
          );
        }}
      </ReactResizeDetector>
    </div>
  );
}
