import { Button } from '@intavia/ui';
import { PageMetadata } from '@stefanprobst/next-page-metadata';
import { Allotment } from 'allotment';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import ReactResizeDetector from 'react-resize-detector';

import { HoverProvider } from '@/app/context/hover.context';
import { PageContext } from '@/app/context/page.context';
import { useI18n } from '@/app/i18n/use-i18n';
import { withDictionaries } from '@/app/i18n/with-dictionaries';
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template';
import { useParams } from '@/app/route/use-params';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { DataPanel } from '@/features/data-panel/data-panel';
import { StoryCenterPane } from '@/features/storycreator/story-center-pane';
import { createSlide, selectStories } from '@/features/storycreator/storycreator.slice';
import { StoryFlow } from '@/features/storycreator/StoryFlow';
import { VisualizationDragger } from '@/features/storycreator/visualization-dragger';
import AllotmentHeader from '@/features/ui/AllotmentHeader';
import { centerPaneProps, leftPaneProps, rightPaneProps } from '@/features/ui/panes.config';
import { selectPaneOpen } from '@/features/ui/ui.slice';

export const getServerSideProps = withDictionaries(['common']);

export default function StoryPage(): JSX.Element {
  const { t } = useI18n<'common'>();
  const titleTemplate = usePageTitleTemplate();

  const metadata = { title: t(['common', 'story', 'metadata', 'title']) };

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <StoryScreen />
    </Fragment>
  );
}

function StoryScreen(): JSX.Element | null {
  const router = useRouter();
  const params = useParams();
  const stories = useAppSelector(selectStories);
  const id = params?.get('id');
  const story = id != null ? stories[id] : null;

  const leftPaneOpen = useAppSelector((state) => {
    return selectPaneOpen(state, 'stc', 'left');
  });

  const rightPaneOpen = useAppSelector((state) => {
    return selectPaneOpen(state, 'stc', 'right');
  });

  const dispatch = useAppDispatch();

  const [openUpperPanel, setOpenUpperPanel] = useState(true);
  const [openBottomPanel, setOpenBottomPanel] = useState(true);

  // const [openLeftUpperPanel, setOpenLeftUpperPanel] = useState(false);
  // const [openLeftBottomPanel, setOpenLeftBottomPanel] = useState(true);

  const [desktop, setDesktop] = useState(true);
  const [timescale, setTimescale] = useState(false);

  useEffect(() => {
    /** Router is not ready yet. */
    if (params == null) return;

    if (story == null) {
      void router.replace({ pathname: '/storycreator' });
    }
  }, [router, params, story]);

  if (story == null) {
    return null;
  }

  return (
    <PageContext.Provider value={{ page: 'story-creator', storyId: id }}>
      <HoverProvider>
        <Allotment>
          <Allotment.Pane
            // className="grid overflow-hidden overflow-y-scroll"
            visible={leftPaneOpen}
            {...leftPaneProps}
            preferredSize="20%"
          >
            <DataPanel />
            {/* <Allotment vertical={true} proportionalLayout={false}>
            <Allotment.Pane
              key={`leftUpperPanel${openLeftUpperPanel}`}
              minSize={24}
              preferredSize={openLeftUpperPanel ? '35%' : 24}
            >
              <div className="grid h-full grid-cols-1 grid-rows-[max-content_1fr]">
                <AllotmentHeader
                  title="Collections"
                  open={openLeftUpperPanel}
                  onClick={() => {
                    setOpenLeftUpperPanel(!openLeftUpperPanel);
                  }}
                />
                <div className="overflow-hidden overflow-y-scroll">Collections</div>
                <DataPanel />
              </div>
            </Allotment.Pane>
            <Allotment.Pane
              key={`leftBottomPanel${openLeftBottomPanel}`}
              minSize={24}
              preferredSize={openLeftBottomPanel ? '65%' : 24}
            >
              <div className="grid h-full grid-cols-1 grid-rows-[max-content_1fr]">
                <AllotmentHeader
                  title="Entities & Events"
                  open={openLeftBottomPanel}
                  onClick={() => {
                    setOpenLeftBottomPanel(!openLeftBottomPanel);
                  }}
                />
                <div className="overflow-hidden overflow-y-scroll">
                  <CollectionPanel draggable mini />
                </div>
              </div>
            </Allotment.Pane>
          </Allotment> */}
          </Allotment.Pane>
          <Allotment.Pane {...centerPaneProps}>
            <StoryCenterPane
              story={story}
              desktop={desktop}
              onDesktopChange={setDesktop}
              timescale={timescale}
              onTimescaleChange={setTimescale}
            />
          </Allotment.Pane>
          <Allotment.Pane
            className="grid overflow-hidden overflow-y-scroll"
            visible={rightPaneOpen}
            {...rightPaneProps}
          >
            <Allotment vertical={true} proportionalLayout={false}>
              <Allotment.Pane
                key={`upperPanel${openUpperPanel}`}
                minSize={24}
                preferredSize={openUpperPanel ? '50%' : 24}
              >
                <div className="grid h-full grid-cols-1 grid-rows-[max-content_1fr]">
                  <AllotmentHeader
                    title="Story Flow"
                    open={openUpperPanel}
                    onClick={() => {
                      setOpenUpperPanel(!openUpperPanel);
                    }}
                  />
                  <div className="overflow-hidden overflow-y-scroll">
                    <ReactResizeDetector handleWidth handleHeight>
                      {({ width, height, targetRef }) => {
                        return (
                          <StoryFlow
                            story={story}
                            vertical={true}
                            width={width}
                            height={height}
                            targetRef={targetRef}
                            slides={story.slides}
                          />
                        );
                      }}
                    </ReactResizeDetector>
                  </div>
                  <div className="flex justify-center border-t border-intavia-neutral-200 p-2">
                    <Button
                      onClick={() => {
                        dispatch(createSlide(story.id));
                      }}
                    >
                      <b>+</b> Add Slide
                    </Button>
                  </div>
                </div>
              </Allotment.Pane>
              <Allotment.Pane
                key={`bottomPanel${openBottomPanel}`}
                minSize={24}
                preferredSize={openBottomPanel ? '35%' : 24}
              >
                <AllotmentHeader
                  title="Contents"
                  open={openBottomPanel}
                  onClick={() => {
                    setOpenBottomPanel(!openBottomPanel);
                  }}
                />
                <VisualizationDragger />
              </Allotment.Pane>
            </Allotment>
          </Allotment.Pane>
        </Allotment>
      </HoverProvider>
    </PageContext.Provider>
  );
}
