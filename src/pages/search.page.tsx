import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { PageMetadata } from '@stefanprobst/next-page-metadata';
<<<<<<< Updated upstream
import { Fragment, useEffect, useMemo } from 'react';
=======
import { Allotment } from 'allotment';
import { Fragment } from 'react';
>>>>>>> Stashed changes

import { useI18n } from '@/app/i18n/use-i18n';
import { withDictionaries } from '@/app/i18n/with-dictionaries';
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template';
<<<<<<< Updated upstream
import { useSearchParams } from '@/app/route/use-search-params';
import { useAppDispatch } from '@/app/store';
import { SearchForm } from '@/features/entities/search-form';
import { SearchPageFooter } from '@/features/entities/search-page-footer';
import { SearchPageHeader } from '@/features/entities/search-page-header';
import { SearchResultsList } from '@/features/entities/search-results-list';
import { SearchResultsSelection } from '@/features/entities/search-results-selection';
import { clearSelection } from '@/features/entities/search-results-selection.slice';
=======
import { CollectionPanel } from '@/features/entities/collection-panel';
import { SearchPanel } from '@/features/entities/search-panel';
import { SearchResultsPanel } from '@/features/entities/search-results-panel';
>>>>>>> Stashed changes

export const getStaticProps = withDictionaries(['common']);

export default function SearchPage(): JSX.Element {
  const { t } = useI18n<'common'>();
  const titleTemplate = usePageTitleTemplate();

  const metadata = { title: t(['common', 'search', 'metadata', 'title']) };

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
<<<<<<< Updated upstream
      <Container maxWidth="md" sx={{ display: 'grid', gap: 4, padding: 4 }}>
        <SearchPageHeader />
        <Paper>
          <SearchForm />
          <SearchResultsList />
          <SearchResultsSelection />
          <SearchPageFooter />
        </Paper>
      </Container>
=======
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
>>>>>>> Stashed changes
    </Fragment>
  );
}
