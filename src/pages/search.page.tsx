import { PageMetadata } from '@stefanprobst/next-page-metadata';
import { Allotment } from 'allotment';
import { Fragment } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { withDictionaries } from '@/app/i18n/with-dictionaries';
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template';
import { CollectionPanel } from '@/features/entities/collection-panel';
import { SearchPanel } from '@/features/entities/search-panel';
import { SearchResultsPanel } from '@/features/entities/search-results-panel';

export const getStaticProps = withDictionaries(['common']);

export default function SearchPage(): JSX.Element {
  const { t } = useI18n<'common'>();
  const titleTemplate = usePageTitleTemplate();

  const metadata = { title: t(['common', 'search', 'metadata', 'title']) };

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <Allotment>
        <Allotment.Pane minSize={250} maxSize={600} snap>
          <SearchPanel />
        </Allotment.Pane>
        <Allotment.Pane minSize={600} snap>
          <SearchResultsPanel />
        </Allotment.Pane>
        <Allotment.Pane minSize={250} maxSize={600} snap>
          <CollectionPanel />
        </Allotment.Pane>
      </Allotment>
    </Fragment>
  );
}
