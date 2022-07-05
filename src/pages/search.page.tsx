import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { PageMetadata } from '@stefanprobst/next-page-metadata';
import { Fragment, useEffect, useMemo } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { withDictionaries } from '@/app/i18n/with-dictionaries';
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template';
import { useSearchParams } from '@/app/route/use-search-params';
import { useAppDispatch } from '@/app/store';
import { SearchForm } from '@/features/entities/search-form';
import { SearchPageFooter } from '@/features/entities/search-page-footer';
import { SearchPageHeader } from '@/features/entities/search-page-header';
import { SearchResultsList } from '@/features/entities/search-results-list';
import { SearchResultsSelection } from '@/features/entities/search-results-selection';
import { clearSelection } from '@/features/entities/search-results-selection.slice';

export const getStaticProps = withDictionaries(['common']);

export default function SearchPage(): JSX.Element {
  const { t } = useI18n<'common'>();
  const titleTemplate = usePageTitleTemplate();
  const dispatch = useAppDispatch();

  /** Clear selection when search params change, except when only `page` changes. */
  const searchParams = useSearchParams();
  const searchParamsWithoutPage = useMemo(() => {
    if (searchParams == null) return null;
    const _searchParams = new URLSearchParams(searchParams);
    _searchParams.delete('page');
    return String(_searchParams);
  }, [searchParams]);

  useEffect(() => {
    if (searchParamsWithoutPage != null) {
      dispatch(clearSelection());
    }
  }, [dispatch, searchParamsWithoutPage]);

  const metadata = { title: t(['common', 'search', 'metadata', 'title']) };

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <Container maxWidth="md" sx={{ display: 'grid', gap: 4, padding: 4 }}>
        <SearchPageHeader />
        <Paper>
          <SearchForm />
          <SearchResultsList />
          <SearchResultsSelection />
          <SearchPageFooter />
        </Paper>
      </Container>
    </Fragment>
  );
}
