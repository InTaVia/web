import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { PageMetadata } from '@stefanprobst/next-page-metadata';
import { Fragment } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { withDictionaries } from '@/app/i18n/with-dictionaries';
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template';
import { SearchForm } from '@/features/entities/search-form';
import { SearchPageFooter } from '@/features/entities/search-page-footer';
import { SearchPageHeader } from '@/features/entities/search-page-header';
import { SearchResultsList } from '@/features/entities/search-results-list';
import { SearchResultsSelection } from '@/features/entities/search-results-selection';
import { SearchResultsSelectionProvider } from '@/features/entities/search-results-selection.context';

export const getStaticProps = withDictionaries(['common']);

export default function SearchPage(): JSX.Element {
  const { t } = useI18n<'common'>();
  const titleTemplate = usePageTitleTemplate();

  const metadata = { title: t(['common', 'search', 'metadata', 'title']) };

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <Container maxWidth="md" sx={{ display: 'grid', gap: 4, padding: 4 }}>
        <SearchResultsSelectionProvider>
          <SearchPageHeader />
          <Paper>
            <SearchForm />
            <SearchResultsList />
            <SearchResultsSelection />
            <SearchPageFooter />
          </Paper>
        </SearchResultsSelectionProvider>
      </Container>
    </Fragment>
  );
}
