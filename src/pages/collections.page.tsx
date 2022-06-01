import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { PageMetadata } from '@stefanprobst/next-page-metadata';
import { Fragment } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';
import { withDictionaries } from '@/app/i18n/with-dictionaries';
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template';
import { CollectionEntitiesList } from '@/features/entities/collection-entities-list';
import { PageTitle } from '@/features/ui/page-title';

export const getStaticProps = withDictionaries(['common']);

export default function CollectionsPage(): JSX.Element {
  const { t } = useI18n<'common'>();
  const titleTemplate = usePageTitleTemplate();

  const metadata = { title: t(['common', 'collections', 'metadata', 'title']) };

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <CollectionsScreen />
    </Fragment>
  );
}

function CollectionsScreen(): JSX.Element {
  return (
    <Container maxWidth="md" sx={{ display: 'grid', gap: 4, padding: 4 }}>
      <header>
        <PageTitle>Collections</PageTitle>
      </header>
      <Paper>
        <CollectionEntitiesList />
      </Paper>
    </Container>
  );
}
