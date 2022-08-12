import { PageMetadata } from '@stefanprobst/next-page-metadata';
import { Allotment } from 'allotment';
import type { LayoutPriority } from 'allotment/dist/types/src/split-view';
import { Fragment } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { withDictionaries } from '@/app/i18n/with-dictionaries';
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template';
import { useAppSelector } from '@/app/store';
import { CollectionPanel } from '@/features/entities/collection-panel';
import { SearchPanel } from '@/features/entities/search-panel';
import { SearchResultsPanel } from '@/features/entities/search-results-panel';
import AllotmentHeader from '@/features/ui/AllotmentHeader';
import DisclosureWrapper from '@/features/ui/DisclosureWrapper';
import {
  centerPaneProps,
  disclosurePaneProps,
  leftPaneProps,
  rightPaneProps,
} from '@/features/ui/panes.config';
import { selectPaneOpen } from '@/features/ui/ui.slice';
import { VisualQueryingModal } from '@/features/visual-querying/VisualQueryingModal';

export const getStaticProps = withDictionaries(['common']);

export default function SearchPage(): JSX.Element {
  const { t } = useI18n<'common'>();
  const titleTemplate = usePageTitleTemplate();

  const metadata = { title: t(['common', 'search', 'metadata', 'title']) };

  const leftPaneOpen = useAppSelector((state) => {
    return selectPaneOpen(state, 'dcl', 'left');
  });

  const rightPaneOpen = useAppSelector((state) => {
    return selectPaneOpen(state, 'dcl', 'right');
  });

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
          <DisclosureWrapper title="Data" defaultOpen={true}>
            <SearchPanel />
          </DisclosureWrapper>
          <DisclosureWrapper title="Search History" defaultOpen={true}></DisclosureWrapper>
        </Allotment.Pane>
        <Allotment.Pane {...centerPaneProps} priority={'HIGH' as LayoutPriority}>
          <SearchResultsPanel />
        </Allotment.Pane>
        <Allotment.Pane
          priority={'LOW' as LayoutPriority}
          className="grid overflow-hidden overflow-y-scroll"
          visible={rightPaneOpen}
          {...rightPaneProps}
        >
          <Allotment vertical={true}>
            <Allotment.Pane {...disclosurePaneProps}>
              <AllotmentHeader title="Test" />
              <CollectionPanel />
            </Allotment.Pane>
            <Allotment.Pane minSize={28} maxSize={28}>
              <AllotmentHeader title="BLA" />
            </Allotment.Pane>
            <Allotment.Pane {...disclosurePaneProps}>
              <AllotmentHeader title="Test" />
              <CollectionPanel />
            </Allotment.Pane>
            <Allotment.Pane {...disclosurePaneProps}>
              <AllotmentHeader title="Test" />
              <CollectionPanel />
            </Allotment.Pane>
          </Allotment>
          {/* <DisclosureWrapper title="Test" defaultOpen={true}>
            <CollectionPanel />
          </DisclosureWrapper>
          <DisclosureWrapper title="Test 2">
            <CollectionPanel />
          </DisclosureWrapper>
          <DisclosureWrapper title="Test 2">
            <CollectionPanel />
          </DisclosureWrapper>
          <DisclosureWrapper title="Test 2">
            <CollectionPanel />
          </DisclosureWrapper> */}
        </Allotment.Pane>
      </Allotment>

      <VisualQueryingModal />
    </Fragment>
  );
}
