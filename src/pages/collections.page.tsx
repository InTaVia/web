import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { PageMetadata } from '@stefanprobst/next-page-metadata';
import type { GetStaticPropsContext, GetStaticPropsResult } from 'next';
import { Fragment } from 'react';

import type { DictionariesProps } from '@/app/i18n/dictionaries';
import { load } from '@/app/i18n/load';
import { useI18n } from '@/app/i18n/use-i18n';
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template';
import { CollectionEntitiesList } from '@/features/entities/collection-entities-list';
import { PageTitle } from '@/features/ui/page-title';
import type { Locale } from '~/config/i18n.config';

type CollectionsPageProps = DictionariesProps<'common'>;

export async function getStaticProps(
  context: GetStaticPropsContext,
): Promise<GetStaticPropsResult<CollectionsPageProps>> {
  const locale = context.locale as Locale;
  const dictionaries = await load(locale, ['common']);

  return { props: { dictionaries } };
}

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
