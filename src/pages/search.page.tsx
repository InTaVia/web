import { PageMetadata } from '@stefanprobst/next-page-metadata';
import { Fragment } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { withDictionaries } from '@/app/i18n/with-dictionaries';
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template';
import { SearchPanel } from '@/components/search/search-panel';
import { SearchResultsPanel } from '@/components/search/search-results-panel';
import { VisualQueryingModal } from '@/features/visual-querying/VisualQueryingModal';

export const getStaticProps = withDictionaries(['common']);

export default function SearchPage(): JSX.Element {
  const { t } = useI18n<'common'>();
  const titleTemplate = usePageTitleTemplate();

  const metadata = { title: t(['common', 'search', 'metadata', 'title']) };

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />

      <div className="grid h-full grid-rows-[auto_1fr] divide-y divide-neutral-200">
        <SearchPanel />
        <SearchResultsPanel />
      </div>

      <VisualQueryingModal />
    </Fragment>
  );
}
