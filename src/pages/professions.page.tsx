import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { PageMetadata } from '@stefanprobst/next-page-metadata';
import { Fragment } from 'react';

import { withDictionaries } from '@/app/i18n/with-dictionaries';
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template';
import { useGetProfessionsQuery } from '@/features/common/intavia-api.service';
import { usePersonsSearchFilters } from '@/features/entities/use-persons-search-filters';
import { Professions } from '@/features/professions/professions';
import { ProfessionsPageHeader } from '@/features/professions/professions-page-header';
import { LeafSizing } from '@/features/professions/professions-svg';
import { Origin } from '@/features/visual-querying/Origin';

export const getStaticProps = withDictionaries(['common']);

export default function ProfessionsPage(): JSX.Element | null {
  const metadata = { title: 'Profession Hierarchy' };

  const titleTemplate = usePageTitleTemplate();

  const searchFilters = usePersonsSearchFilters();
  const { data, isLoading } = useGetProfessionsQuery(searchFilters);

  const origin = new Origin();

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <Container maxWidth="md" sx={{ display: 'grid', gap: 4, padding: 4 }}>
        <ProfessionsPageHeader />
        <Paper sx={{ minHeight: '50vh', display: 'grid' }}>
          {isLoading ? (
            <Typography role="status">Loading...</Typography>
          ) : (
            <Professions origin={origin} leafSizing={LeafSizing.Quantitative} professions={data!} />
          )}
        </Paper>
      </Container>
    </Fragment>
  );
}
