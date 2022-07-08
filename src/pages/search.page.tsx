import { PageMetadata } from '@stefanprobst/next-page-metadata';
import { Allotment } from 'allotment';
import { Fragment } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { withDictionaries } from '@/app/i18n/with-dictionaries';
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template';
import { useAppSelector } from '@/app/store';
import { CollectionPanel } from '@/features/entities/collection-panel';
import { SearchPanel } from '@/features/entities/search-panel';
import { SearchResultsPanel } from '@/features/entities/search-results-panel';
import DisclosureWrapper from '@/features/ui/DisclosureWrapper';
import { centerPaneProps, leftPaneProps, rightPaneProps } from '@/features/ui/panes.config';
import { selectPaneOpen } from '@/features/ui/ui.slice';

export const getStaticProps = withDictionaries(['common']);

export default function SearchPage(): JSX.Element {
  const { t } = useI18n<'common'>();
  const titleTemplate = usePageTitleTemplate();

  const metadata = { title: t(['common', 'search', 'metadata', 'title']) };

  const leftPaneOpen = useAppSelector((state) => {
    return selectPaneOpen(state, 'vas', 'left');
  });

  const rightPaneOpen = useAppSelector((state) => {
    return selectPaneOpen(state, 'vas', 'right');
  });

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <Allotment>
        <Allotment.Pane visible={leftPaneOpen} {...leftPaneProps}>
          <DisclosureWrapper title="Data" defaultOpen={true}>
            <SearchPanel />
          </DisclosureWrapper>
          <DisclosureWrapper title="Search History" defaultOpen={true}></DisclosureWrapper>
        </Allotment.Pane>
        <Allotment.Pane {...centerPaneProps}>
          <SearchResultsPanel />
        </Allotment.Pane>
        <Allotment.Pane visible={rightPaneOpen} {...rightPaneProps}>
          <DisclosureWrapper title="Test" defaultOpen={true}>
            <CollectionPanel />
          </DisclosureWrapper>
        </Allotment.Pane>
      </Allotment>
    </Fragment>
  );
}
