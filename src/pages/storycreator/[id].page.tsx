import { Container } from '@mui/material';
import { PageMetadata } from '@stefanprobst/next-page-metadata';
import type { LayoutPriority } from 'allotment';
import { Allotment } from 'allotment';
import { useRouter } from 'next/router';
import { Fragment, RefObject, useEffect, useState } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { withDictionaries } from '@/app/i18n/with-dictionaries';
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template';
import { useParams } from '@/app/route/use-params';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { CollectionPanel } from '@/features/entities/collection-panel';
import { SearchPanel } from '@/features/entities/search-panel';
import { SearchResultsPanel } from '@/features/entities/search-results-panel';
import { SlideEditor } from '@/features/storycreator/SlideEditor';
import { StoryCenterPane } from '@/features/storycreator/story-center-pane';
import { StoryCreator } from '@/features/storycreator/StoryCreator';
import type { Slide, Story } from '@/features/storycreator/storycreator.slice';
import { selectSlidesByStoryID, selectStories } from '@/features/storycreator/storycreator.slice';
import AllotmentHeader from '@/features/ui/AllotmentHeader';
import DisclosureWrapper from '@/features/ui/DisclosureWrapper';
import {
  centerPaneProps,
  disclosurePaneProps,
  leftPaneProps,
  rightPaneProps,
} from '@/features/ui/panes.config';
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
  const { t } = useI18n<'common'>();
  const titleTemplate = usePageTitleTemplate();
  const metadata = { title: t(['common', 'search', 'metadata', 'title']) };
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

  const [openUpperPanel, setOpenUpperPanel] = useState(true);
  const [openBottomPanel, setOpenBottomPanel] = useState(false);

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
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <Allotment proportionalLayout={false}>
        <Allotment.Pane
          priority={'LOW' as LayoutPriority}
          className="grid overflow-hidden overflow-y-scroll"
          visible={leftPaneOpen}
          {...leftPaneProps}
        >
          LEFT
        </Allotment.Pane>
        <Allotment.Pane {...centerPaneProps} priority={'HIGH' as LayoutPriority}>
          <StoryCenterPane story={story} />
        </Allotment.Pane>
        <Allotment.Pane
          priority={'LOW' as LayoutPriority}
          className="grid overflow-hidden overflow-y-scroll"
          visible={rightPaneOpen}
          {...rightPaneProps}
        >
          <Allotment vertical={true}>
            <Allotment.Pane
              key={`$upperPanel{openUpperPanel}`}
              minSize={28}
              preferredSize={openUpperPanel ? '50%' : 28}
            >
              <AllotmentHeader
                title="TEST"
                open={openUpperPanel}
                onClick={() => {
                  setOpenUpperPanel(!openUpperPanel);
                }}
              />
              TEST
            </Allotment.Pane>
            <Allotment.Pane
              key={`bottomPanel${openBottomPanel}`}
              minSize={28}
              preferredSize={openBottomPanel ? '50%' : 28}
            >
              <AllotmentHeader
                title="BLA"
                open={openBottomPanel}
                onClick={() => {
                  setOpenBottomPanel(!openBottomPanel);
                }}
              />
              BLA
            </Allotment.Pane>
          </Allotment>
        </Allotment.Pane>
      </Allotment>
    </Fragment>
  );

  /* return (
    <Container maxWidth={false} sx={{ height: '95vh', display: 'grid', gap: 4, padding: 4 }}>
      <StoryCreator story={story} />
    </Container>
  ); */
}
