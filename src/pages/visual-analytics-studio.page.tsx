import { PageMetadata } from '@stefanprobst/next-page-metadata';
import { Fragment } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { withDictionaries } from '@/app/i18n/with-dictionaries';
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template';

export const getStaticProps = withDictionaries(['common']);

export default function VisualAnalyticsStudioPage(): JSX.Element {
  // const { t } = useI18n<'common'>();
  const titleTemplate = usePageTitleTemplate();

  // t(['common', 'visual-analytics-studio', 'metadata', 'title'])
  const metadata = { title: 'visual-analytics-studio' };

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <main>
        <h1>Visual Analytics Studio</h1>
      </main>
    </Fragment>
  );
}
